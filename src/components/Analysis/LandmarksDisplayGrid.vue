<template>
  <div>
    <div v-if="landmarks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <LandmarkCard
        v-for="(item, index) in visibleLandmarks"
        :key="item.id ?? index"
        :title="item.title ?? ''"
        :subtitle="item.display_subtitle ?? item.subtitle"
        :content="displayContent(item)"
        :badge="displayBadge(item)"
        :link-to="item.id ? `/app/landmarks/${item.id}` : null"
      />
    </div>

    <button
      v-if="showSeeMore"
      type="button"
      class="mt-3 text-sm underline text-slate-400 hover:text-slate-200 transition-colors"
      @click="expanded = true"
    >
      voir plus
    </button>

    <div v-if="landmarks.length === 0" class="text-sm text-slate-500">
      {{ emptyText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import LandmarkCard from '@/components/Analysis/LandmarkCard.vue'

const props = withDefaults(defineProps<{
  landmarks: Array<Record<string, any>>
  emptyText?: string
  contentMax?: number
}>(), {
  emptyText: 'Aucun landmark',
  contentMax: 200
})

const expanded = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

const cardsPerRow = computed(() => {
  if (viewportWidth.value >= 1280) return 3
  if (viewportWidth.value >= 768) return 2
  return 1
})

const visibleLandmarks = computed(() => {
  if (expanded.value) return props.landmarks
  return props.landmarks.slice(0, cardsPerRow.value)
})

const showSeeMore = computed(() => !expanded.value && props.landmarks.length > cardsPerRow.value)

const landmarkTypeLabel = (type: string | undefined): string => {
  if (!type) return ''
  const normalized = type.trim().toLowerCase()
  if (normalized === 'rsrc') return 'Ressource'
  if (normalized === 'autr') return 'Auteur'
  if (normalized === 'them') return 'Thème'
  if (normalized === 'task') return 'Tâche'
  if (normalized === 'qest') return 'Question'
  if (normalized === 'dlvr') return 'Livrable'
  if (normalized === 'proc') return 'Processus'
  if (normalized === 'topic') return 'Sujet'
  if (normalized === 'project') return 'Projet'
  if (normalized === 'person') return 'Personne'
  return type.trim()
}

const shortText = (text: string | undefined): string => {
  if (!text) return ''
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= props.contentMax) return normalized
  return `${normalized.slice(0, props.contentMax)}...`
}

const displayBadge = (item: Record<string, any>): string => {
  if (typeof item.display_badge === 'string') return item.display_badge
  return landmarkTypeLabel(item.landmark_type ?? item.landmarkType)
}

const displayContent = (item: Record<string, any>): string => {
  if (typeof item.display_content === 'string') return shortText(item.display_content)
  const content = shortText(item.content ?? item.description ?? item.summary)
  if (content) return content
  if (typeof item.count === 'number') return `${item.count} co-occurrences`
  return ''
}

const updateViewportWidth = () => {
  if (typeof window === 'undefined') return
  viewportWidth.value = window.innerWidth
}

watch(
  () => props.landmarks.map((item) => String(item?.id ?? '')).join(','),
  () => {
    expanded.value = false
  }
)

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
})
</script>
