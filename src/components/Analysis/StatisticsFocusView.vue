<template>
  <div class="mt-2">
    <div class="mb-4 ml-auto flex flex-col gap-2 w-full xl:w-1/4">
      <label for="context-landmark-select" class="text-sm text-slate-300">
        Landmark
      </label>
      <select
        id="context-landmark-select"
        v-model="selectedLandmarkId"
        class="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        :disabled="isLoadingContextLandmarks"
      >
        <option value="">
          {{ isLoadingContextLandmarks ? 'Chargement...' : 'Heatmap globale' }}
        </option>
        <option
          v-for="landmark in sortedLandmarks"
          :key="landmark.id"
          :value="landmark.id"
        >
          {{ truncatedLandmarkTitle(landmark.title) }} ({{ elementCountByLandmarkId[landmark.id] ?? 0 }})
        </option>
      </select>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <HeatmapDisplay
        :days="displayedHeatmapDays"
        :range-start="displayedRangeStart"
        :range-end="displayedRangeEnd"
        :loading="displayedHeatmapLoading"
        title="Activité"
        :empty-text="displayedEmptyText"
        month-locale="fr-FR"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import HeatmapDisplay from '@/components/Heatmap/HeatmapDisplay.vue'
import type { LandmarkDetail } from '@/composables/useLandmark'
import { useUser } from '@/composables/useUser'

const props = defineProps<{
  id: string
}>()

type ContextLandmark = {
  id: string
  title?: string
  subtitle?: string
  content?: string
  landmark_type?: string
  [key: string]: any
}

type HeatmapDay = {
  day: string
  value: number
}

const HEATMAP_MONTH_WINDOW = 8
const { user } = useUser()
const analysisLandmarks = ref<ContextLandmark[]>([])
const landmarkById = ref<Record<string, LandmarkDetail>>({})
const isLoadingContextLandmarks = ref(false)
const isLoadingUserHeatmap = ref(false)
const userHeatmapDays = ref<HeatmapDay[]>([])
const selectedLandmarkId = ref('')
const DROPDOWN_TITLE_MAX_LENGTH = 44

const toUtcDate = (rawDate: unknown): Date | null => {
  if (!rawDate) return null
  const parsed = new Date(String(rawDate))
  if (Number.isNaN(parsed.getTime())) return null
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()))
}

const dayKeyFromDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const heatmapWindow = computed(() => {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (HEATMAP_MONTH_WINDOW - 1), 1))
  return { start, end }
})

const truncatedLandmarkTitle = (title: string | undefined): string => {
  const normalized = (title || 'Sans titre').replace(/\s+/g, ' ').trim()
  if (normalized.length <= DROPDOWN_TITLE_MAX_LENGTH) return normalized
  return `${normalized.slice(0, DROPDOWN_TITLE_MAX_LENGTH - 3)}...`
}

const elementCountByLandmarkId = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {}
  for (const landmark of analysisLandmarks.value) {
    const related = landmarkById.value[landmark.id]?.related_elements ?? []
    counts[landmark.id] = related.length
  }
  return counts
})

const sortedLandmarks = computed<ContextLandmark[]>(() => {
  return [...analysisLandmarks.value].sort((a, b) => {
    const countA = elementCountByLandmarkId.value[a.id] ?? 0
    const countB = elementCountByLandmarkId.value[b.id] ?? 0
    if (countB !== countA) return countB - countA
    return (a.title || '').localeCompare(b.title || '', 'fr', { sensitivity: 'base' })
  })
})

const selectedLandmark = computed<LandmarkDetail | null>(() => {
  if (!selectedLandmarkId.value) return null
  return landmarkById.value[selectedLandmarkId.value] ?? null
})

const selectedLandmarkHeatmapDays = computed<HeatmapDay[]>(() => {
  const counts = new Map<string, number>()
  const elements = selectedLandmark.value?.related_elements ?? []
  const { start, end } = heatmapWindow.value

  for (const element of elements) {
    const rawDate = (element as any).interaction_date ?? element.created_at
    const dayDate = toUtcDate(rawDate)
    if (!dayDate) continue
    if (dayDate < start || dayDate > end) continue
    const dayKey = dayKeyFromDate(dayDate)
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([day, value]) => ({ day, value }))
})

const displayedHeatmapDays = computed<HeatmapDay[]>(() => {
  if (selectedLandmarkId.value) return selectedLandmarkHeatmapDays.value
  return userHeatmapDays.value
})

const displayedHeatmapLoading = computed(() => {
  if (selectedLandmarkId.value) return isLoadingContextLandmarks.value
  return isLoadingUserHeatmap.value
})

const displayedRangeStart = computed(() => {
  if (selectedLandmarkId.value) return heatmapWindow.value.start
  return null
})

const displayedRangeEnd = computed(() => {
  if (selectedLandmarkId.value) return heatmapWindow.value.end
  return null
})

const displayedEmptyText = computed(() => {
  if (selectedLandmarkId.value) return 'Aucun élément daté pour ce landmark'
  return 'Aucune donnée'
})

const toLandmarksArray = (raw: unknown): ContextLandmark[] => {
  if (Array.isArray(raw)) return raw as ContextLandmark[]
  if (raw && typeof raw === 'object' && Array.isArray((raw as any).data)) {
    return (raw as any).data as ContextLandmark[]
  }
  return []
}

const loadContextLandmarks = async () => {
  isLoadingContextLandmarks.value = true
  try {
    const [allResponse, contextResponse, currentResponse] = await Promise.allSettled([
      fetchWrapper.get(`/analysis/${props.id}/landmarks`),
      fetchWrapper.get(`/analysis/${props.id}/landmarks?kind=context`),
      fetchWrapper.get(`/analysis/${props.id}/landmarks?kind=current`)
    ])

    const allLandmarks = allResponse.status === 'fulfilled'
      ? toLandmarksArray(allResponse.value.data)
      : []
    const contextLandmarks = contextResponse.status === 'fulfilled'
      ? toLandmarksArray(contextResponse.value.data)
      : []
    const currentLandmarks = currentResponse.status === 'fulfilled'
      ? toLandmarksArray(currentResponse.value.data)
      : []

    const mergedById = new Map<string, ContextLandmark>()
    for (const landmark of [...allLandmarks, ...contextLandmarks, ...currentLandmarks]) {
      if (!landmark?.id) continue
      mergedById.set(landmark.id, landmark as ContextLandmark)
    }
    analysisLandmarks.value = Array.from(mergedById.values())

    const details = await Promise.all(
      analysisLandmarks.value.map(async (landmark) => {
        try {
          const detailResponse = await fetchWrapper.get(`/landmarks/${landmark.id}`)
          return [landmark.id, detailResponse.data as LandmarkDetail] as const
        } catch (error) {
          console.error(`Error loading landmark detail ${landmark.id}:`, error)
          return [landmark.id, { id: landmark.id, related_elements: [] } as LandmarkDetail] as const
        }
      })
    )

    landmarkById.value = Object.fromEntries(details)
  } catch (error) {
    console.error('Error fetching context landmarks:', error)
    analysisLandmarks.value = []
    landmarkById.value = {}
  } finally {
    isLoadingContextLandmarks.value = false
  }
}

const loadUserHeatmap = async (userId: string) => {
  if (!userId) return
  isLoadingUserHeatmap.value = true
  try {
    const response = await fetchWrapper.get(`/users/${userId}/heatmaps`)
    userHeatmapDays.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching user heatmaps:', error)
    userHeatmapDays.value = []
  } finally {
    isLoadingUserHeatmap.value = false
  }
}

watch(
  () => sortedLandmarks.value.map((landmark) => landmark.id).join(','),
  () => {
    if (!selectedLandmarkId.value) return
    const currentExists = sortedLandmarks.value.some((landmark) => landmark.id === selectedLandmarkId.value)
    if (!currentExists) {
      selectedLandmarkId.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.id,
  async () => {
    selectedLandmarkId.value = ''
    await loadContextLandmarks()
  }
)

watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) {
      userHeatmapDays.value = []
      isLoadingUserHeatmap.value = false
      return
    }
    await loadUserHeatmap(userId)
  },
  { immediate: true }
)

onMounted(async () => {
  await loadContextLandmarks()
})
</script>
