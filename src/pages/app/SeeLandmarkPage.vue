<template>
  <div class="p-4 md:px-24">
    <div v-if="loading" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else-if="landmark">
      <div class="mb-6">
        <button
          type="button"
          @click="goBack"
          class="text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ← Back
        </button>
      </div>

      <h1 class="text-3xl font-bold mb-6">Landmark Details</h1>

      <!-- Base Info -->
      <div class="mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">

          <div class="flex items-center justify-between mb-3">
            <div>
          <div v-if="landmark.title" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Title</div>
            <div class="text-2xl font-bold">{{ landmark.title }}</div>
          </div>
          <div v-if="landmark.subtitle" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subtitle</div>
            <div class="text-lg">{{ landmark.subtitle }}</div>
          </div>
          </div>
          <div v-if="!isMobile">
          <HeatmapDisplay
            :days="relatedElementsHeatmapDays"
            :range-start="heatmapWindow.start"
            :range-end="heatmapWindow.end"
            empty-text="No dated elements found"
            month-locale="en-US"
            :weekday-labels="weekdayLabels"
            :show-legend="false"
            :show-max="false"
          />
          </div>

          </div>
          <div v-if="landmark.content">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Content</div>
            <div class="whitespace-pre-wrap text-sm">{{ landmark.content }}</div>
          </div>
          <div class="mt-4 border-t border-slate-200 dark:border-zinc-700 pt-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Base fields</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="entry in baseFieldEntries"
                :key="entry.key"
                class="rounded-md border border-slate-200 dark:border-zinc-700 px-3 py-2"
              >
                <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {{ entry.label }}
                </div>
                <div class="text-sm text-gray-800 dark:text-gray-200 break-words mt-0.5">
                  {{ entry.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Related Elements Heatmap -->
      <div class="mb-6" v-if="isMobile &&landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements Activity</h2>
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <HeatmapDisplay
            :days="relatedElementsHeatmapDays"
            :range-start="heatmapWindow.start"
            :range-end="heatmapWindow.end"
            empty-text="No dated elements found"
            month-locale="en-US"
            :weekday-labels="weekdayLabels"
            legend-less-label="Less"
            legend-more-label="More"
          />
        </div>
      </div>

      <!-- Parent Landmarks -->
      <div class="mb-6" v-if="landmark.parent_landmarks && landmark.parent_landmarks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Parent Landmarks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            v-for="parent in visibleParentLandmarks"
            :key="parent.id"
            :to="`/app/landmarks/${parent.id}`"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Parent</div>
            <div class="text-base font-medium">{{ parent.title || 'Untitled' }}</div>
          </router-link>
        </div>
        <button
          v-if="hasMoreParentLandmarks && !showAllParentLandmarks"
          type="button"
          class="mt-3 text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          @click="showAllParentLandmarks = true"
        >
          Show all
        </button>
      </div>


      <!-- Co-occurring Landmarks -->
      <div class="mb-6" v-if="cooccurringLandmarks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Landmarks</h2>
        <LandmarksDisplayGrid :landmarks="cooccurringLandmarkCards" />
      </div>

      <!-- Related Elements -->
      <div class="mb-6" v-if="landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ElementDisplayCard
            v-for="element in landmark.related_elements"
            :key="element.id"
            :element="element"
            :associated-landmarks="elementLandmarksById[element.id] ?? []"
            tone="dark"
          />
        </div>
      </div>

      <!-- Related Elements Journal Display -->
      <div class="mb-6" v-if="landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements Journal View</h2>
        <div class="max-w-2xl mx-auto">
          <div class="journal-canvas min-h-[320px]">
            <div class="traces-scroll h-full overflow-y-auto pr-2">
              <div class="paper-content">
                <div
                  v-for="element in landmark.related_elements"
                  :key="`journal-${element.id}`"
                  class="journal-element-entry py-2 border-b border-slate-300/40 last:border-b-0"
                >
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                    <div class="text-xs text-slate-500">
                      {{ elementInteractionDateDisplay(element) }}
                    </div>
                    <div class="flex flex-wrap gap-1.5 md:justify-end">
                      <router-link
                        v-for="relatedLandmark in elementLandmarksById[element.id] ?? []"
                        :key="`chip-${element.id}-${relatedLandmark.id ?? relatedLandmark.title}`"
                        :to="`/me/landmarks/${relatedLandmark.id}`"
                        class="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-400/70 text-slate-600 bg-white/65 hover:border-slate-500 hover:text-slate-800 transition-colors"
                      >
                        {{ relatedLandmark.title || 'Sans nom' }}
                      </router-link>
                    </div>
                  </div>
                  <div
                    v-for="(span, spanIndex) in elementSpans(element)"
                    :key="`span-${element.id}-${spanIndex}`"
                    class="font-georgia text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap"
                  >
                    {{ span }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-2xl pt-10 text-red-600">Landmark not found</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeatmapDisplay from '@/components/Heatmap/HeatmapDisplay.vue'
import ElementDisplayCard from '@/components/Element/ElementDisplayCard.vue'
import LandmarksDisplayGrid from '@/components/Analysis/LandmarksDisplayGrid.vue'
import { fetchWrapper } from '@/helpers'
import { useLandmark, type LandmarkDetail } from '@/composables/useLandmark'
import { useMenu } from '@/composables/useMenu'

const { isMobile } = useMenu()
const { getLandmark } = useLandmark()
const router = useRouter()

const props = defineProps<{
  id: string
}>()

const landmark = ref<LandmarkDetail | null>(null)
const loading = ref(true)
const showAllParentLandmarks = ref(false)
const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const HEATMAP_MONTH_WINDOW = 6

type HeatmapDay = {
  day: string
  value: number
}

type ElementLandmark = {
  id?: string
  title?: string
}

type CooccurringLandmark = {
  id: string
  title: string
  count: number
}

type CooccurringLandmarkCard = {
  id: string
  title: string
  display_subtitle: string
  display_content: string
  landmark_type?: string
}

type BaseFieldEntry = {
  key: string
  label: string
  value: string
}

const elementLandmarksById = ref<Record<string, ElementLandmark[]>>({})
const cooccurringLandmarkById = ref<Record<string, any>>({})

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/me')
}

const parentLandmarks = computed(() => landmark.value?.parent_landmarks ?? [])

const visibleParentLandmarks = computed(() => {
  if (showAllParentLandmarks.value) return parentLandmarks.value
  return parentLandmarks.value.slice(0, 4)
})

const hasMoreParentLandmarks = computed(() => parentLandmarks.value.length > 4)

const toDisplayValue = (value: unknown): string => {
  if (value == null) return '-'
  if (value instanceof Date) return value.toLocaleString()
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value.map((item) => toDisplayValue(item)).join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (_error) {
      return String(value)
    }
  }
  const text = String(value).trim()
  return text.length > 0 ? text : '-'
}

const baseFieldEntries = computed<BaseFieldEntry[]>(() => {
  const item = landmark.value
  if (!item) return []

  const entries: BaseFieldEntry[] = [
    { key: 'id', label: 'ID', value: toDisplayValue(item.id) },
    { key: 'landmark_type', label: 'Type', value: toDisplayValue(item.landmark_type) },
    { key: 'title', label: 'Title', value: toDisplayValue(item.title) },
    { key: 'subtitle', label: 'Subtitle', value: toDisplayValue(item.subtitle) },
    { key: 'analysis_id', label: 'Analysis ID', value: toDisplayValue(item.analysis_id) },
    { key: 'user_id', label: 'User ID', value: toDisplayValue(item.user_id) },
    { key: 'parent_id', label: 'Parent ID', value: toDisplayValue(item.parent_id) },
    { key: 'maturing_state', label: 'Maturing state', value: toDisplayValue(item.maturing_state) },
    { key: 'created_at', label: 'Created at', value: toDisplayValue(item.created_at) },
    { key: 'updated_at', label: 'Updated at', value: toDisplayValue(item.updated_at) }
  ]

  return entries.filter((entry) => entry.value !== '-' || entry.key === 'landmark_type')
})

const dayKeyFromDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toUtcDate = (rawDate: unknown): Date | null => {
  if (!rawDate) return null
  const parsed = new Date(String(rawDate))
  if (Number.isNaN(parsed.getTime())) return null
  const date = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()))
  if (Number.isNaN(date.getTime())) return null
  return date
}

const heatmapWindow = computed(() => {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (HEATMAP_MONTH_WINDOW - 1), 1))
  return { start, end }
})

const relatedElementsCountByDay = computed(() => {
  const counts = new Map<string, number>()
  const elements = landmark.value?.related_elements ?? []
  const { start, end } = heatmapWindow.value

  for (const element of elements) {
    const rawDate = (element as any).interaction_date ?? element.created_at
    const dayDate = toUtcDate(rawDate)
    if (!dayDate) continue
    if (dayDate < start || dayDate > end) continue
    const dayKey = dayKeyFromDate(dayDate)
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1)
  }

  return counts
})

const relatedElementsHeatmapDays = computed<HeatmapDay[]>(() => {
  return Array.from(relatedElementsCountByDay.value.entries()).map(([day, value]) => ({ day, value }))
})

const cooccurringLandmarks = computed<CooccurringLandmark[]>(() => {
  const currentLandmarkId = landmark.value?.id ? String(landmark.value.id).trim() : ''
  if (!currentLandmarkId) return []

  const counts = new Map<string, { title: string; count: number }>()
  const relatedElements = landmark.value?.related_elements ?? []

  for (const element of relatedElements) {
    const elementId = getElementId(element)
    if (!elementId) continue
    const landmarks = elementLandmarksById.value[elementId] ?? []
    const seenForElement = new Set<string>()

    for (const candidate of landmarks) {
      const candidateId = candidate?.id != null ? String(candidate.id).trim() : ''
      if (!candidateId) continue
      if (candidateId === currentLandmarkId) continue
      if (seenForElement.has(candidateId)) continue
      seenForElement.add(candidateId)

      const title = typeof candidate?.title === 'string' && candidate.title.trim().length > 0
        ? candidate.title.trim()
        : 'Sans titre'
      const previous = counts.get(candidateId)
      if (previous) {
        previous.count += 1
      } else {
        counts.set(candidateId, { title, count: 1 })
      }
    }
  }

  return Array.from(counts.entries())
    .map(([id, value]) => ({ id, title: value.title, count: value.count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.title.localeCompare(b.title, 'fr-FR')
    })
})

const cooccurringLandmarkCards = computed<CooccurringLandmarkCard[]>(() => {
  return cooccurringLandmarks.value.map((item) => ({
    id: item.id,
    title: cooccurringLandmarkById.value[item.id]?.title ?? item.title,
    display_subtitle: `${item.count} relation${item.count > 1 ? 's' : ''}`,
    display_content: cooccurringLandmarkById.value[item.id]?.content ?? '',
    landmark_type: cooccurringLandmarkById.value[item.id]?.landmark_type
  }))
})

const getElementId = (element: any): string | null => {
  const id = element?.id
  if (id == null) return null
  const value = String(id).trim()
  return value.length > 0 ? value : null
}

const decodeJsonEncodedContent = (content: unknown): any | null => {
  if (typeof content !== 'string') return null
  let current: any = content.trim()
  if (!current) return null

  for (let depth = 0; depth < 3; depth++) {
    if (typeof current !== 'string') return current
    const trimmed = current.trim()
    if (!trimmed) return null
    const startsLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')
    if (!startsLikeJson) return depth === 0 ? null : current
    try {
      current = JSON.parse(trimmed)
    } catch (_error) {
      return depth === 0 ? null : current
    }
  }
  return current
}

const elementSpans = (element: any): string[] => {
  const direct = element?.spans ?? element?.span
  if (Array.isArray(direct)) {
    const normalized = direct
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value) => value.length > 0)
    if (normalized.length > 0) return normalized
  } else if (typeof direct === 'string' && direct.trim().length > 0) {
    return [direct.trim()]
  }

  const decoded = decodeJsonEncodedContent(element?.content ?? element?.resource?.content ?? '')
  if (decoded && typeof decoded === 'object') {
    const raw = (decoded as any).spans ?? (decoded as any).span
    if (Array.isArray(raw)) {
      const normalized = raw
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0)
      if (normalized.length > 0) return normalized
    } else if (typeof raw === 'string' && raw.trim().length > 0) {
      return [raw.trim()]
    }
  }

  const fallback = typeof element?.title === 'string' && element.title.trim().length > 0
    ? element.title.trim()
    : 'Élément'
  return [fallback]
}

const elementInteractionDateDisplay = (element: any): string => {
  const raw = element?.interaction_date ?? element?.interactionDate ?? element?.created_at ?? element?.createdAt
  if (!raw) return 'Date inconnue'
  const date = new Date(String(raw))
  if (Number.isNaN(date.getTime())) return String(raw)
  return date.toLocaleString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadElementLandmarks = async (elementId: string) => {
  if (!elementId) return
  if (elementLandmarksById.value[elementId] != null) return

  try {
    const response = await fetchWrapper.get(`/elements/${elementId}/landmarks`)
    elementLandmarksById.value[elementId] = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(`Error fetching landmarks for element ${elementId}:`, error)
    elementLandmarksById.value[elementId] = []
  }
}

const loadCooccurringLandmarkDetail = async (landmarkId: string) => {
  if (!landmarkId) return
  if (cooccurringLandmarkById.value[landmarkId] != null) return

  try {
    const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
    cooccurringLandmarkById.value[landmarkId] = response.data ?? null
  } catch (error) {
    console.error(`Error fetching co-occurring landmark ${landmarkId}:`, error)
    cooccurringLandmarkById.value[landmarkId] = null
  }
}

const loadData = async () => {
  try {
    loading.value = true
    showAllParentLandmarks.value = false
    elementLandmarksById.value = {}
    cooccurringLandmarkById.value = {}
    landmark.value = await getLandmark(props.id)
    const relatedElements = landmark.value?.related_elements ?? []
    const elementIds = relatedElements
      .map((element: any) => getElementId(element))
      .filter((value): value is string => Boolean(value))
    await Promise.all(elementIds.map((elementId) => loadElementLandmarks(elementId)))

    const cooccurringIds = cooccurringLandmarks.value.map((item) => item.id)
    await Promise.all(cooccurringIds.map((landmarkId) => loadCooccurringLandmarkDetail(landmarkId)))
  } catch (error) {
    console.error('Error loading landmark:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadData()
})

watch(() => props.id, async () => {
  await loadData()
})
</script>

<style scoped>
.journal-canvas {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(217, 119, 6, 0.25);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(248, 250, 252, 0.55));
  padding: 16px;
}

.traces-scroll {
  border-radius: 14px;
}

.paper-content {
  background-color: rgba(255, 255, 255, 0.32);
  background-image:
    linear-gradient(to right, rgba(251, 113, 133, 0.32), rgba(251, 113, 133, 0.32)),
    repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.06) 0,
      rgba(0, 0, 0, 0.06) 1px,
      transparent 1px,
      transparent 36px
    );
  background-repeat: no-repeat, repeat;
  background-size: 1px 100%, 100% 36px;
  background-position: 44px 0, 0 0;
  border-radius: 14px;
  min-height: 100%;
  padding: 8px 12px 8px 58px;
}

@media (max-width: 768px) {
  .paper-content {
    padding-left: 42px;
    background-position: 30px 0, 0 0;
  }
}
</style>
