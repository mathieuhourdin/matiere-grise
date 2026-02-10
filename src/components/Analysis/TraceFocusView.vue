<template>
  <div v-if="!analysis" class="text-center text-2xl pt-10">Loading...</div>
  <div v-else>
    <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Left: raw trace -->
      <section class="xl:col-span-1">
        <h3 class="text-xl font-bold mb-4">Trace brute</h3>
        <div class="journal-canvas min-h-[420px]">
          <div class="traces-scroll h-full overflow-y-auto pr-2">
            <div class="paper-content">
              <template v-if="trace">
                <div v-if="traceInteractionDate" class="text-xs text-slate-500 mb-2">
                  {{ formatDate(traceInteractionDate) }}
                </div>
                <article class="trace-entry text-[17px] text-slate-700 whitespace-pre-line leading-[2]">
                  <div class="font-handwritten text-4xl mb-2 leading-tight text-slate-800">
                    {{ splitTraceText(trace).first }}
                  </div>
                  <div v-if="splitTraceText(trace).rest" class="font-georgia">
                    {{ splitTraceText(trace).rest }}
                  </div>
                </article>
              </template>
              <div v-else class="text-sm text-slate-500">Aucune trace</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: analysis output -->
      <section class="xl:col-span-1 space-y-8">

        <div>
          <h3 class="text-xl font-bold mb-4">Elements simples</h3>
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="(item, index) in visibleSimpleElements"
              :key="item.id ?? index"
              class="h-full p-3 rounded-lg border border-slate-700 bg-slate-800/40"
            >
              <div class="text-sm font-semibold text-slate-200 line-clamp-2">
                {{ itemTitle(item) || 'Sans titre' }}
              </div>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <template v-if="elementLandmarksLoadingById[getElementId(item) || '']">
                  <span class="text-[10px] text-slate-400">Chargement...</span>
                </template>
                <template v-else-if="elementLandmarksById[getElementId(item) || '']?.length">
                  <span
                    v-for="landmark in elementLandmarksById[getElementId(item) || '']"
                    :key="`${item.id}-${landmark.id || landmark.title}`"
                    class="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-600 text-slate-300 bg-slate-900/60"
                  >
                    {{ landmark.title || 'Sans nom' }}
                  </span>
                </template>
                <template v-else>
                  <span class="text-[10px] text-slate-500">Aucun landmark</span>
                </template>
              </div>
            </div>
          </div>
          <button
            v-if="showSeeMoreSimpleElements"
            type="button"
            class="mt-3 text-sm underline text-slate-400 hover:text-slate-200 transition-colors"
            @click="expandSimpleElements = true"
          >
            voir plus
          </button>
        </div>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { fetchWrapper } from '@/helpers'

const props = defineProps<{
  id: string
}>()

const analysis = ref<any>(null)
const trace = ref<any>(null)
const elements = ref<any[]>([])
const expandSimpleElements = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
type ElementLandmark = {
  id?: string
  title?: string
}
const elementLandmarksById = ref<Record<string, ElementLandmark[]>>({})
const elementLandmarksLoadingById = ref<Record<string, boolean>>({})

const loadAnalysis = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}`)
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

const loadAnalysisElements = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/elements`)
    elements.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching analysis elements:', error)
    elements.value = []
  }
}


const getElementType = (item: any): string => {
  return item?.resource?.resource_type ?? item?.resource_type ?? item?.type ?? item?.element_type ?? ''
}

const filterElementsByType = (items: any[], type: string, aliases: string[] = []) => {
  const matchTypes = [type, ...aliases]
  return items.filter((item: any) => matchTypes.includes(getElementType(item)))
}

const simpleElements = computed(() => {
  const evnt = filterElementsByType(elements.value, 'evnt', ['event'])
  if (evnt.length > 0) return evnt
  const rsrc = filterElementsByType(elements.value, 'rsrc', ['resource'])
  const trce = filterElementsByType(elements.value, 'trce', ['trace'])
  const knownIds = new Set([...rsrc.map((i: any) => i?.id), ...trce.map((i: any) => i?.id)].filter(Boolean))
  return elements.value.filter((item: any) => !item?.id || !knownIds.has(item.id))
})

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

const visibleSimpleElements = computed(() => firstRowSlice(simpleElements.value, expandSimpleElements.value))

const showSeeMoreSimpleElements = computed(() => !expandSimpleElements.value && hasMoreThanOneRow(simpleElements.value.length))

const traceInteractionDate = computed(() => {
  const t = trace.value
  return t?.interaction_date ?? t?.interactionDate ?? undefined
})

const itemTitle = (item: any): string => item?.title ?? item?.resource?.title ?? ''

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const splitTraceText = (rawTrace: any) => {
  const raw = rawTrace?.content || rawTrace?.title || 'Trace sans contenu'
  const lines = String(raw).split('\n')
  const first = lines.shift() ?? ''
  const rest = lines.join('\n').trim()
  return { first, rest }
}

const getElementId = (item: any): string | null => {
  const id = item?.id
  if (id == null) return null
  const value = String(id).trim()
  return value.length > 0 ? value : null
}

const loadElementLandmarks = async (elementId: string) => {
  if (!elementId) return
  if (elementLandmarksById.value[elementId] != null) return
  if (elementLandmarksLoadingById.value[elementId]) return

  elementLandmarksLoadingById.value[elementId] = true
  try {
    const response = await fetchWrapper.get(`/elements/${elementId}/landmarks`)
    elementLandmarksById.value[elementId] = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(`Error fetching landmarks for element ${elementId}:`, error)
    elementLandmarksById.value[elementId] = []
  } finally {
    elementLandmarksLoadingById.value[elementId] = false
  }
}

watch(
  () => visibleSimpleElements.value.map((item) => getElementId(item)).filter(Boolean).join(','),
  async () => {
    const elementIds = visibleSimpleElements.value
      .map((item) => getElementId(item))
      .filter((value): value is string => Boolean(value))
    await Promise.all(elementIds.map((elementId) => loadElementLandmarks(elementId)))
  },
  { immediate: true }
)

const getAnalyzedTraceId = (a: any): string | null => {
  if (!a) return null
  const id = a.analyzed_trace_id ?? a.analyzedTraceId
  if (id == null) return null
  const s = String(id).trim()
  return s.length > 0 ? s : null
}

const updateViewportWidth = () => {
  if (typeof window === 'undefined') return
  viewportWidth.value = window.innerWidth
}

onMounted(async () => {
  expandSimpleElements.value = false
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)

  await loadAnalysis()
  const a = analysis.value
  if (a) {
    const traceId = getAnalyzedTraceId(a)
    if (traceId) {
      await loadTrace(traceId)
    }
  }

  await loadAnalysisElements()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
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

.trace-entry {
  animation: fadeInUp 220ms ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .traces-scroll {
    border-radius: 12px;
  }

  .paper-content {
    padding-left: 42px;
    background-position: 30px 0, 0 0;
  }
}
</style>
