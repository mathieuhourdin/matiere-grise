<template>
  <section>
    <div class="mb-2 flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-slate-200">Derniers landmarks</h2>
      <router-link
        v-if="displayLandscapeAnalysis?.id"
        :to="{ name: 'analysis', params: { id: displayLandscapeAnalysis.id } }"
        class="text-sm text-slate-400 underline hover:text-slate-200 transition-colors"
      >
        voir plus
      </router-link>
    </div>

    <div v-if="!displayLandscapeAnalysis" class="text-sm text-slate-500 mt-3">
      Aucune analyse courante
    </div>
    <div v-else-if="isLoadingLandmarks" class="text-sm text-slate-500 mt-3">
      Chargement...
    </div>
    <div v-else-if="visibleLandmarks.length === 0" class="text-sm text-slate-500 mt-3">
      Aucun landmark
    </div>
    <div v-else class="flex gap-3 overflow-x-auto pb-2 mt-3">
      <router-link
        v-for="landmark in visibleLandmarks"
        :key="landmark.id"
        :to="`/app/landmarks/${landmark.id}`"
        class="block w-48 h-36 overflow-hidden flex-shrink-0 rounded-xl border border-slate-700 bg-slate-900/60 p-2.5 hover:border-slate-500 hover:bg-slate-800/70 transition-colors"
      >
        <div class="h-full flex flex-col min-h-0">
          <div class="text-xs font-semibold text-slate-200 mb-1 leading-4 line-clamp-2">
            {{ landmark.title || 'Sans titre' }}
          </div>
          <div v-if="subtitleWithType(landmark.landmark_type, landmark.subtitle)" class="text-[10px] text-slate-400 mb-1 truncate">
            {{ subtitleWithType(landmark.landmark_type, landmark.subtitle) }}
          </div>
          <ul class="text-[10px] text-slate-300 space-y-0.5 flex-1 min-h-0 overflow-y-auto pr-1">
            <li
              v-for="element in relatedElements(landmark.id)"
              :key="element.id"
              class="overflow-hidden text-ellipsis whitespace-nowrap"
              :title="elementHoverTitle(element)"
            >
              {{ formatShortDate(element.created_at) }} - {{ element.title || 'Sans titre' }}
            </li>
            <li
              v-if="relatedElementsLoadingById[landmark.id]"
              class="text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              Chargement...
            </li>
            <li
              v-if="!relatedElementsLoadingById[landmark.id] && relatedElements(landmark.id).length === 0"
              class="text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              Aucun element
            </li>
          </ul>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useLens, type Landmark } from '@/composables/useLens'

const { displayLandmarks, displayLandscapeAnalysis, isLoadingLandmarks } = useLens()
const relatedElementsLoadingById = ref<Record<string, boolean>>({})
type RelatedElement = { id: string; title?: string; subtitle?: string; content?: string; created_at?: string | Date }
const relatedElementsByLandmarkId = ref<Record<string, RelatedElement[]>>({})

const sortedLandmarks = computed<Landmark[]>(() => {
  return [...displayLandmarks.value].sort((a, b) => {
    const dateA = new Date((a as any).created_at || 0).getTime()
    const dateB = new Date((b as any).created_at || 0).getTime()
    return dateB - dateA
  })
})

const visibleLandmarks = computed<Landmark[]>(() => {
  return sortedLandmarks.value.slice(0, 4)
})

const loadRelatedElements = async (landmarkId: string) => {
  if (!landmarkId) return
  if (relatedElementsByLandmarkId.value[landmarkId] != null) return
  if (relatedElementsLoadingById.value[landmarkId]) return

  relatedElementsLoadingById.value[landmarkId] = true
  try {
    const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
    const related = Array.isArray(response.data?.related_elements) ? response.data.related_elements : []
    relatedElementsByLandmarkId.value[landmarkId] = related
  } catch (error) {
    console.error(`Error loading related elements for landmark ${landmarkId}:`, error)
    relatedElementsByLandmarkId.value[landmarkId] = []
  } finally {
    relatedElementsLoadingById.value[landmarkId] = false
  }
}

watch(
  () => visibleLandmarks.value.map((l) => l.id).join(','),
  async () => {
    await Promise.all(visibleLandmarks.value.map((l) => loadRelatedElements(l.id)))
  },
  { immediate: true }
)

const relatedElements = (landmarkId: string): RelatedElement[] => {
  return relatedElementsByLandmarkId.value[landmarkId] ?? []
}

const formatShortDate = (date: string | Date | undefined): string => {
  if (!date) return '--/--/--'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(dateObj.getTime())) return '--/--/--'
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = String(dateObj.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

const landmarkTypeLabel = (type: string | undefined): string => {
  if (!type) return 'Landmark'
  if (type === 'rsrc') return 'Ressource'
  if (type === 'autr') return 'Auteur'
  if (type === 'them') return 'Theme'
  if (type === 'task') return 'Task'
  if (type === 'qest') return 'Question'
  return type
}

const subtitleWithType = (type: string | undefined, subtitle?: string): string => {
  const label = landmarkTypeLabel(type).toUpperCase()
  if (!subtitle) return label
  return `${label} - ${subtitle}`
}

const elementHoverTitle = (element: RelatedElement): string => {
  const base = `${formatShortDate(element.created_at)} - ${element.title || 'Sans titre'}`
  const content = element.content?.trim()
  if (!content) return base
  return `${base}\n${content}`
}

</script>
