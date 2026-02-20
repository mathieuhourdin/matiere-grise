<template>
  <section class="font-inter">
    <div v-if="!displayLandscapeAnalysis" class="text-sm text-slate-500 mt-3">
      Aucune analyse courante
    </div>
    <div v-else-if="isLoadingLandmarks || isLoadingCounts" class="text-sm text-slate-500 mt-3">
      Chargement...
    </div>
    <div v-else-if="visibleLandmarks.length === 0" class="text-sm text-slate-500 mt-3">
      Aucun landmark
    </div>
    <div v-else class="mt-3">
      <ul class="list-disc list-outside pl-4 space-y-1">
        <li
          v-for="landmark in visibleLandmarks"
          :key="landmark.id"
          class="text-slate-300 marker:text-slate-500"
        >
          <router-link
            :to="`/app/landmarks/${landmark.id}`"
            class="text-xs leading-[0.95rem] text-slate-200 hover:text-slate-100 transition-colors whitespace-normal break-words"
          >
            <span>{{ landmark.title || 'Sans titre' }}</span>
            <span class="text-slate-500"> ({{ elementCount(landmark.id) }} éléments)</span>
          </router-link>
        </li>
      </ul>
      <div class="mt-2 flex justify-end">
        <router-link
          v-if="displayLandscapeAnalysis?.id"
          :to="{ name: 'analysis', params: { id: displayLandscapeAnalysis.id }, query: { view: 'compare' } }"
          class="text-xs text-slate-400 underline hover:text-slate-200 transition-colors"
        >
          voir plus
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useLens, type Landmark } from '@/composables/useLens'

const { displayLandmarks, displayLandscapeAnalysis, isLoadingLandmarks } = useLens()
const relatedElementsCountByLandmarkId = ref<Record<string, number>>({})
const isLoadingCounts = ref(false)

const loadRelatedElementsCount = async (landmarkId: string) => {
  if (!landmarkId) return
  if (relatedElementsCountByLandmarkId.value[landmarkId] != null) return

  try {
    const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
    const relatedElements = Array.isArray(response.data?.related_elements) ? response.data.related_elements : []
    relatedElementsCountByLandmarkId.value[landmarkId] = relatedElements.length
  } catch (error) {
    console.error(`Error loading related elements count for landmark ${landmarkId}:`, error)
    relatedElementsCountByLandmarkId.value[landmarkId] = 0
  }
}

const sortedLandmarks = computed<Landmark[]>(() => {
  return [...displayLandmarks.value].sort((a, b) => {
    const countA = relatedElementsCountByLandmarkId.value[a.id] ?? 0
    const countB = relatedElementsCountByLandmarkId.value[b.id] ?? 0
    if (countA !== countB) return countB - countA
    const dateA = new Date((a as any).created_at || 0).getTime()
    const dateB = new Date((b as any).created_at || 0).getTime()
    return dateB - dateA
  })
})

const visibleLandmarks = computed<Landmark[]>(() => {
  return sortedLandmarks.value.slice(0, 4)
})

const elementCount = (landmarkId: string): number => {
  return relatedElementsCountByLandmarkId.value[landmarkId] ?? 0
}

watch(
  () => displayLandmarks.value.map((landmark) => landmark.id).join(','),
  async () => {
    if (displayLandmarks.value.length === 0) return
    isLoadingCounts.value = true
    try {
      await Promise.all(displayLandmarks.value.map((landmark) => loadRelatedElementsCount(landmark.id)))
    } finally {
      isLoadingCounts.value = false
    }
  },
  { immediate: true }
)
</script>
