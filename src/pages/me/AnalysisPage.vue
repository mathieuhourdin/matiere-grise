<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div v-if="analysis" class="mb-6">
      <div class="flex justify-between items-start mb-1 gap-3">
        <div class="text-lg font-bold">{{ formatDate(analyzedTrace?.interaction_date ?? analyzedTrace?.created_at) }} - {{ traceMirror?.title ?? analysis.title }}</div>
        <router-link
          v-if="replayedFromRoute"
          :to="replayedFromRoute"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors text-sm"
        >
          Analyse source
        </router-link>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <router-link
          v-if="previousAnalysisRoute"
          :to="previousAnalysisRoute"
          class="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 underline transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          <span>Précédent</span>
        </router-link>
        <router-link
          v-if="nextAnalysisRoute"
          :to="nextAnalysisRoute"
          class="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 underline transition-colors"
        >
          <span>Suivant</span>
          <ChevronRightIcon class="w-4 h-4" />
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
          @click="setActiveView(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <LandscapeFocusView
      v-if="activeView === 'compare'"
      :id="currentAnalysisId ?? ''"
    />
    <template v-else-if="currentAnalysisId">
      <TraceFocusView v-if="activeView === 'current'" :id="currentAnalysisId" />
      <TraceMirrorFocusView v-if="activeView === 'mirror'" :id="currentAnalysisId" />
      <AnalysisFocusView v-if="activeView === 'summary'" :id="currentAnalysisId" />
      <StatisticsFocusView v-if="activeView === 'timeline'" :id="currentAnalysisId" />
    </template>
    <div v-else class="text-sm text-slate-400">
      Aucune analyse sélectionnée.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TraceFocusView from '@/components/Analysis/TraceFocusView.vue'
import TraceMirrorFocusView from '@/components/Analysis/TraceMirrorFocusView.vue'
import AnalysisFocusView from '@/components/Analysis/AnalysisFocusView.vue'
import LandscapeFocusView from '@/components/Analysis/LandscapeFocusView.vue'
import StatisticsFocusView from '@/components/Analysis/StatisticsFocusView.vue'
import { useLens } from '@/composables/useLens'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { fetchWrapper } from '@/helpers'
import { useMenu } from '@/composables/useMenu'

const route = useRoute()
const router = useRouter()
const { headLandscapeAnalysis, headLandscapeAnalysisParents, loadUserLenses } = useLens()
const { headerValue } = useMenu()
const analysis = ref<any>(null)
const traceMirror = ref<any>(null)
const analyzedTrace = ref<any>(null)

// Ordered list: head first, then parents (so "next" = parent = older, "previous" = child = newer)
const analysisNavigationIds = computed(() => {
  const headId = headLandscapeAnalysis.value?.id
  const parentIds = (headLandscapeAnalysisParents.value ?? []).map((p) => p.id)
  const list = headId ? [headId, ...parentIds] : [...parentIds]
  return list.filter(Boolean)
})

const queryParam = (value: unknown): string | null => {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null
  const normalized = raw.trim()
  return normalized.length > 0 ? normalized : null
}

const currentAnalysisId = computed(() => queryParam(route.query.id))

const currentAnalysisIndex = computed(() => {
  const currentId = currentAnalysisId.value
  if (!currentId) return -1
  const idx = analysisNavigationIds.value.indexOf(currentId)
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
  { id: 'mirror', label: 'Focus Mirror' },
  { id: 'summary', label: 'Analyse' },
  { id: 'compare', label: 'Paysage global' },
  { id: 'timeline', label: 'Statistiques' }
] as const

const activeView = ref<(typeof viewOptions)[number]['id']>('current')
const validViewIds = new Set(viewOptions.map((option) => option.id))
const defaultView = viewOptions[0].id

const toAnalysisRoute = (analysisId: string) => ({
  name: 'analysis',
  query: {
    id: analysisId,
    tab: activeView.value
  }
})

const previousAnalysisRoute = computed(() => {
  if (!previousAnalysisId.value) return null
  return toAnalysisRoute(previousAnalysisId.value)
})

const nextAnalysisRoute = computed(() => {
  if (!nextAnalysisId.value) return null
  return toAnalysisRoute(nextAnalysisId.value)
})

const loadAnalysis = async (analysisId: string | null) => {
  if (!analysisId) {
    analysis.value = null
    traceMirror.value = null
    analyzedTrace.value = null
    return
  }

  try {
    const response = await fetchWrapper.get(`/analysis/${analysisId}`)
    analysis.value = response.data?.analysis ?? response.data ?? null

    const traceMirrorResponse = await fetchWrapper.get(`/trace_mirrors/${analysis.value?.trace_mirror_id}`)
    traceMirror.value = traceMirrorResponse.data ?? null

    const analyzedTraceResponse = await fetchWrapper.get(`/traces/${analysis.value?.analyzed_trace_id}`)
    analyzedTrace.value = analyzedTraceResponse.data ?? null
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

const replayedFromRoute = computed(() => {
  if (!replayedFromId.value) return null
  return toAnalysisRoute(replayedFromId.value)
})

const setActiveView = async (view: (typeof viewOptions)[number]['id']) => {
  if (!validViewIds.has(view)) return
  activeView.value = view
  const query: Record<string, string> = { tab: view }
  if (currentAnalysisId.value) query.id = currentAnalysisId.value
  await router.replace({ name: 'analysis', query })
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

watch(currentAnalysisId, async (analysisId) => {
  await Promise.all([loadUserLenses(), loadAnalysis(analysisId)])
  if (analysis.value?.id && analysis.value?.title) {
    headerValue.value = { text: analysis.value.title, link: `/me/analysis?id=${analysis.value.id}` }
  } else {
    headerValue.value = { text: 'Analyse', link: '/me/analysis' }
  }
}, { immediate: true })

watch(() => [route.name, route.query.tab, route.query.view], ([routeName, tabValue, legacyViewValue]) => {
  if (routeName !== 'analysis') return
  const tab = queryParam(tabValue)
  const legacyView = queryParam(legacyViewValue)
  const tabIsValid = Boolean(tab && validViewIds.has(tab as (typeof viewOptions)[number]['id']))
  const candidate = tab ?? legacyView
  if (candidate && validViewIds.has(candidate as (typeof viewOptions)[number]['id'])) {
    activeView.value = candidate as (typeof viewOptions)[number]['id']
    if (!tab && legacyView) {
      const query: Record<string, string> = { tab: activeView.value }
      if (currentAnalysisId.value) query.id = currentAnalysisId.value
      router.replace({ name: 'analysis', query })
    }
    return
  }
  activeView.value = defaultView
  if (!tabIsValid) {
    const query: Record<string, string> = { tab: defaultView }
    if (currentAnalysisId.value) query.id = currentAnalysisId.value
    router.replace({ name: 'analysis', query })
  }
}, { immediate: true })

onUnmounted(() => {
  headerValue.value = null
})
</script>
