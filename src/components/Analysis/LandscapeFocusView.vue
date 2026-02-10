<template>
  <div class="mt-2">
    <h3 class="text-xl font-bold mb-4">Entités de l'analyse</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <AnalysisItemCard
        v-for="(item, index) in visibleContextLandmarks"
        :key="item.id ?? index"
        :title="item.title ?? ''"
        :subtitle="item.subtitle"
        :content="shortText(item.content)"
        :badge="landmarkTypeLabel(item.landmark_type)"
        :link-to="item.id ? `/app/landmarks/${item.id}` : null"
      />
    </div>
    <button
      v-if="showSeeMoreContextLandmarks"
      type="button"
      class="mt-3 text-sm underline text-slate-400 hover:text-slate-200 transition-colors"
      @click="expandContextLandmarks = true"
    >
      voir plus
    </button>
    <div v-if="contextLandmarks.length === 0" class="text-sm text-slate-500">
      Aucune entité
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import AnalysisItemCard from '@/components/Analysis/AnalysisItemCard.vue'

const props = defineProps<{
  id: string
}>()

const contextLandmarks = ref<any[]>([])
const expandContextLandmarks = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

const cardsPerRow = computed(() => {
  if (viewportWidth.value >= 1280) return 3
  if (viewportWidth.value >= 768) return 2
  return 1
})

const hasMoreThanOneRow = (itemsLength: number) => itemsLength > cardsPerRow.value

const firstRowSlice = <T>(items: T[], expanded: boolean): T[] => {
  if (expanded) return items
  return items.slice(0, cardsPerRow.value)
}

const visibleContextLandmarks = computed(() => firstRowSlice(contextLandmarks.value, expandContextLandmarks.value))
const showSeeMoreContextLandmarks = computed(() => !expandContextLandmarks.value && hasMoreThanOneRow(contextLandmarks.value.length))

const landmarkTypeLabel = (type: string | undefined): string => {
  if (!type) return ''
  if (type === 'rsrc') return 'Ressource'
  if (type === 'autr') return 'Auteur'
  if (type === 'them') return 'Thème'
  return ''
}

const shortText = (text: string | undefined, max = 140): string => {
  if (!text) return ''
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max)}...`
}

const loadContextLandmarks = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/landmarks?kind=context`)
    contextLandmarks.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching context landmarks:', error)
    contextLandmarks.value = []
  }
}

const updateViewportWidth = () => {
  if (typeof window === 'undefined') return
  viewportWidth.value = window.innerWidth
}

onMounted(async () => {
  expandContextLandmarks.value = false
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
  await loadContextLandmarks()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
})
</script>
