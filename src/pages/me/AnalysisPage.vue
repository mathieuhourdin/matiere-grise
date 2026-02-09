<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div v-if="!analysis" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else>
      <!-- Navigation: previous / next analysis -->
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

      <!-- Display the analysis -->
      <div class="mb-8">
        <div class="flex justify-between items-start mb-2 gap-3">
          <div class="text-lg font-bold">{{ formatDate(analysis.created_at) }} - {{ analysis.title }}</div>
          <div class="flex items-center gap-2">
            <router-link
              v-if="replayedFromId"
              :to="`/me/analysis/${replayedFromId}`"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors text-sm"
            >
              Analyse source
            </router-link>
            <ActionButton type="abort" size="sm" @click="handleDelete">
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </ActionButton>
          </div>
        </div>
      </div>

      <!-- Trace (from GET traces/:id via analysis.analyzed_trace_id) -->
      <div v-if="trace" class="mt-8">
        <h3 class="text-xl font-bold mb-4">Trace</h3>
        <div class="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-800/40">
          <div v-if="traceInteractionDate" class="text-sm text-slate-400 mb-2">{{ formatDate(traceInteractionDate) }}</div>
          <div v-if="trace.content" class="text-sm text-slate-300 whitespace-pre-line">{{ trace.content }}</div>
        </div>
      </div>

      <!-- Elements from GET landscape_analysis/:id/elements -->
      <div class="mt-8">
        <h3 class="text-xl font-bold mb-4">Elements simples</h3>
        <AnalysisItemCard
          v-for="(item, index) in simpleElements"
          :key="item.id ?? index"
          :title="itemTitle(item)"
          :subtitle="itemSubtitle(item)"
          :content="itemContent(item)"
        />
      </div>

      <!-- Mentioned landmarks from GET analysis/:id/landmarks?kind=mentioned -->
      <div class="mt-8">
        <h3 class="text-xl font-bold mb-4">Resources (Mentionnés)</h3>
        <AnalysisItemCard
          v-for="(item, index) in mentionedLandmarks"
          :key="item.id ?? index"
          :title="item.title ?? ''"
          :subtitle="item.subtitle"
          :content="item.content"
          :badge="landmarkTypeLabel(item.landmark_type)"
          :link-to="item.id ? `/app/landmarks/${item.id}` : null"
        />
        <div v-if="mentionedLandmarks.length === 0" class="text-sm text-slate-500">
          Aucun landmark mentionné
        </div>
      </div>

      <!-- Context landmarks from GET analysis/:id/landmarks?kind=context -->
      <div class="mt-8">
        <h3 class="text-xl font-bold mb-4">Resources (Contexte)</h3>
        <AnalysisItemCard
          v-for="(item, index) in contextLandmarks"
          :key="item.id ?? index"
          :title="item.title ?? ''"
          :subtitle="item.subtitle"
          :content="item.content"
          :badge="landmarkTypeLabel(item.landmark_type)"
          :link-to="item.id ? `/app/landmarks/${item.id}` : null"
        />
        <div v-if="contextLandmarks.length === 0" class="text-sm text-slate-500">
          Aucun landmark de contexte
        </div>
      </div>

      <!-- Traces from elements (type trce) -->
      <div class="mt-8">
        <h3 class="text-xl font-bold mb-4">Traces</h3>
        <AnalysisItemCard
          v-for="(item, index) in filterElementsByType(elements, 'trce')"
          :key="item.id ?? index"
          :title="itemTitle(item)"
          :subtitle="itemSubtitle(item)"
          :content="itemContent(item)"
        />
      </div>

      <!-- LLM Calls from GET analysis/:id/llm_calls -->
      <div class="mt-8">
        <h3 class="text-xl font-bold mb-4">LLM Calls</h3>
        <div class="space-y-4">
          <LlmCallCard
            v-for="llmCall in llmCalls"
            :key="llmCall.id"
            :llm-call="llmCall"
          />
        </div>
        <div v-if="llmCalls.length === 0" class="text-sm text-slate-500">
          Aucun appel LLM
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWrapper } from '@/helpers'
import { useMenu } from '@/composables/useMenu'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import { useLens } from '@/composables/useLens'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { type LlmCall } from '@/types/models'
import LlmCallCard from '@/components/LlmCall/LlmCallCard.vue'
import AnalysisItemCard from '@/components/Analysis/AnalysisItemCard.vue'
const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { headerValue } = useMenu()
const { deleteAnalysis } = useUser()
const { launchSnackbar } = useSnackbar()
const { headLandscapeAnalysis, headLandscapeAnalysisParents, loadUserLenses } = useLens()

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

const analysis = ref<any>(null)
const trace = ref<any>(null)
const mentionedLandmarks = ref<any[]>([])
const contextLandmarks = ref<any[]>([])
const elements = ref<any[]>([])
const llmCalls = ref<LlmCall[]>([])
const isDeleting = ref(false)

const replayedFromId = computed(() => {
  const id = analysis.value?.replayed_from_id ?? analysis.value?.replayedFromId
  if (id == null) return null
  const s = String(id).trim()
  return s.length > 0 ? s : null
})

const loadAnalysis = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}`)
    // Support both direct body or nested (e.g. response.data.analysis)
    analysis.value = response.data?.analysis ?? response.data ?? null
  } catch (error) {
    console.error('Error fetching analysis:', error)
    analysis.value = null
  }
}

const loadTrace = async (traceId: string) => {
  try {
    const response = await fetchWrapper.get(`/traces/${traceId}`)
    trace.value = response.data
  } catch (error) {
    console.error('Error fetching trace:', error)
    trace.value = null
  }
}

const loadLandmarks = async (kind: 'mentioned' | 'context') => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/landmarks?kind=${kind}`)
    const list = Array.isArray(response.data) ? response.data : []
    if (kind === 'mentioned') {
      mentionedLandmarks.value = list
    } else {
      contextLandmarks.value = list
    }
  } catch (error) {
    console.error('Error fetching analysis landmarks:', error)
    if (kind === 'mentioned') {
      mentionedLandmarks.value = []
    } else {
      contextLandmarks.value = []
    }
  }
}

const loadAnalysisElements = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/elements`)
    elements.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching analysis elements:', error)
    elements.value = []
  }
}

const loadLlmCalls = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/llm_calls`)
    llmCalls.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching analysis llm_calls:', error)
    llmCalls.value = []
  }
}

// Support multiple API shapes: type can be on item.resource.resource_type, item.resource_type, item.type, item.element_type
const getElementType = (item: any): string => {
  return item?.resource?.resource_type ?? item?.resource_type ?? item?.type ?? item?.element_type ?? ''
}

const filterElementsByType = (items: any[], type: string, aliases: string[] = []) => {
  const matchTypes = [type, ...aliases]
  return items.filter((item: any) => matchTypes.includes(getElementType(item)))
}

// Simple elements: evnt/event, or any element that is not rsrc and not trce (fallback if API uses different type keys)
const simpleElements = computed(() => {
  const evnt = filterElementsByType(elements.value, 'evnt', ['event'])
  if (evnt.length > 0) return evnt
  const rsrc = filterElementsByType(elements.value, 'rsrc', ['resource'])
  const trce = filterElementsByType(elements.value, 'trce', ['trace'])
  const knownIds = new Set([...rsrc.map((i: any) => i?.id), ...trce.map((i: any) => i?.id)].filter(Boolean))
  return elements.value.filter((item: any) => !item?.id || !knownIds.has(item.id))
})

// Trace display: support snake_case and camelCase for interaction_date
const traceInteractionDate = computed(() => {
  const t = trace.value
  return t?.interaction_date ?? t?.interactionDate ?? undefined
})

// Display helpers: support both top-level and nested resource (title, subtitle, content)
const itemTitle = (item: any): string => item?.title ?? item?.resource?.title ?? ''
const itemSubtitle = (item: any): string => item?.subtitle ?? item?.resource?.subtitle ?? ''
const itemContent = (item: any): string => item?.content ?? item?.resource?.content ?? ''

const landmarkTypeLabel = (type: string | undefined): string => {
  if (!type) return ''
  if (type === 'rsrc') return 'Ressource'
  if (type === 'autr') return 'Auteur'
  if (type === 'them') return 'Thème'
  return ''
}


const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleDelete = async () => {
  if (!analysis.value?.id || isDeleting.value) return
  
  const confirmed = window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')
  if (!confirmed) return

  try {
    isDeleting.value = true
    await deleteAnalysis(analysis.value.id)
    launchSnackbar('Analysis deleted successfully', 'success')
    router.push('/me/home')
  } catch (error) {
    console.error('Error deleting analysis:', error)
    isDeleting.value = false
  }
}

// Read trace id from analysis (support snake_case and camelCase)
const getAnalyzedTraceId = (a: any): string | null => {
  if (!a) return null
  const id = a.analyzed_trace_id ?? a.analyzedTraceId
  if (id == null) return null
  const s = String(id).trim()
  return s.length > 0 ? s : null
}

onMounted(async () => {
  await loadAnalysis()
  const a = analysis.value
  if (a) {
    headerValue.value = { text: a.title, link: `/me/analysis/${a.id}` }
    const traceId = getAnalyzedTraceId(a)
    if (traceId) {
      await loadTrace(traceId)
    }
  }

  await loadUserLenses()
  await Promise.all([loadLandmarks('mentioned'), loadLandmarks('context')])
  await loadAnalysisElements()
  await loadLlmCalls()
})

onUnmounted(() => {
  headerValue.value = null
})
</script>
