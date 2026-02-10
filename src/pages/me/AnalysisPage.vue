<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <router-link
        v-if="previousAnalysisId"
        :to="`/me/analysis/${previousAnalysisId}`"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
      >
        <ChevronLeftIcon class="w-5 h-5" />
        <span>Précédent</span>
      </router-link>
      <span v-else class="invisible flex items-center gap-2 px-4 py-2">
        <ChevronLeftIcon class="w-5 h-5" />
        <span>Précédent</span>
      </span>
      <router-link
        v-if="nextAnalysisId"
        :to="`/me/analysis/${nextAnalysisId}`"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
      >
        <span>Suivant</span>
        <ChevronRightIcon class="w-5 h-5" />
      </router-link>
      <span v-else class="invisible flex items-center gap-2 px-4 py-2">
        <span>Suivant</span>
        <ChevronRightIcon class="w-5 h-5" />
      </span>
    </div>

    <div v-if="analysis" class="mb-6">
      <div class="flex justify-between items-start mb-2 gap-3">
        <div class="text-lg font-bold">{{ formatDate(analysis.created_at) }} - {{ analysis.title }}</div>
        <router-link
          v-if="replayedFromId"
          :to="`/me/analysis/${replayedFromId}`"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors text-sm"
        >
          Analyse source
        </router-link>
      </div>
    </div>

    <div class="mb-6">
      <div class="inline-flex rounded-lg border border-slate-700 bg-slate-900/60 p-0.5">
        <button
          v-for="option in viewOptions"
          :key="option.id"
          type="button"
          class="px-3 py-1.5 text-xs rounded-md transition-colors"
          :class="activeView === option.id ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'"
          @click="activeView = option.id"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <TraceFocusView v-if="activeView === 'current'" :id="id" />
    <AnalysisFocusView v-if="activeView === 'summary'" :id="id" />
    <LandscapeFocusView v-if="activeView === 'compare'" :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TraceFocusView from '@/components/Analysis/TraceFocusView.vue'
import AnalysisFocusView from '@/components/Analysis/AnalysisFocusView.vue'
import LandscapeFocusView from '@/components/Analysis/LandscapeFocusView.vue'
import { useLens } from '@/composables/useLens'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { fetchWrapper } from '@/helpers'
import { useMenu } from '@/composables/useMenu'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { headLandscapeAnalysis, headLandscapeAnalysisParents, loadUserLenses } = useLens()
const { headerValue } = useMenu()
const analysis = ref<any>(null)

// Ordered list: head first, then parents (so "next" = parent = older, "previous" = child = newer)
const analysisNavigationIds = computed(() => {
  const headId = headLandscapeAnalysis.value?.id
  const parentIds = (headLandscapeAnalysisParents.value ?? []).map((p) => p.id)
  const list = headId ? [headId, ...parentIds] : [...parentIds]
  return list.filter(Boolean)
})

const currentAnalysisIndex = computed(() => {
  const idx = analysisNavigationIds.value.indexOf(props.id)
  return idx >= 0 ? idx : -1
})

const previousAnalysisId = computed(() => {
  const idx = currentAnalysisIndex.value
  if (idx < 0) return null
  return analysisNavigationIds.value[idx + 1] ?? null
})

const nextAnalysisId = computed(() => {
  const idx = currentAnalysisIndex.value
  if (idx < 0) return null
  return idx > 0 ? analysisNavigationIds.value[idx - 1] : null
})

const viewOptions = [
  { id: 'current', label: 'Focus Trace' },
  { id: 'summary', label: 'Analyse' },
  { id: 'compare', label: 'Paysage global' },
  { id: 'timeline', label: 'Analytique' }
] as const

const activeView = ref<(typeof viewOptions)[number]['id']>('current')
const validViewIds = new Set(viewOptions.map((option) => option.id))

const loadAnalysis = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}`)
    analysis.value = response.data?.analysis ?? response.data ?? null
  } catch (error) {
    console.error('Error fetching analysis:', error)
    analysis.value = null
  }
}

const replayedFromId = computed(() => {
  const id = analysis.value?.replayed_from_id ?? analysis.value?.replayedFromId
  if (id == null) return null
  const s = String(id).trim()
  return s.length > 0 ? s : null
})

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

watch(() => props.id, async () => {
  await Promise.all([loadUserLenses(), loadAnalysis()])
  if (analysis.value?.id && analysis.value?.title) {
    headerValue.value = { text: analysis.value.title, link: `/me/analysis/${analysis.value.id}` }
  }
}, { immediate: true })

watch(() => route.query.view, (value) => {
  const view = Array.isArray(value) ? value[0] : value
  if (typeof view === 'string' && validViewIds.has(view as (typeof viewOptions)[number]['id'])) {
    activeView.value = view as (typeof viewOptions)[number]['id']
  }
}, { immediate: true })

onMounted(() => {
  if (analysis.value?.id && analysis.value?.title) {
    headerValue.value = { text: analysis.value.title, link: `/me/analysis/${analysis.value.id}` }
  }
})

onUnmounted(() => {
  headerValue.value = null
})
</script>
