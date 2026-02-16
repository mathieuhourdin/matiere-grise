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
                  <div class="font-handwritten text-4xl mb-2 leading-tight text-slate-800 whitespace-pre-wrap">
                    <span
                      v-for="(segment, segmentIndex) in highlightedFirstSegments"
                      :key="`first-${segmentIndex}`"
                      :style="segment.color ? { backgroundColor: segment.color } : undefined"
                      class="rounded-[3px] px-[1px]"
                    >
                      {{ segment.text }}
                    </span>
                  </div>
                  <div v-if="traceSplit.rest" class="font-georgia whitespace-pre-wrap">
                    <span
                      v-for="(segment, segmentIndex) in highlightedRestSegments"
                      :key="`rest-${segmentIndex}`"
                      :style="segment.color ? { backgroundColor: segment.color } : undefined"
                      class="rounded-[3px] px-[1px]"
                    >
                      {{ segment.text }}
                    </span>
                  </div>
                </article>
              </template>
              <div v-else class="text-sm text-slate-500">Aucune trace</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: analysis output -->
      <section class="xl:col-span-1 space-y-8 font-inter">

        <div>
          <h3 class="text-xl font-bold mb-4">Elements détectés</h3>
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="(item, index) in visibleSimpleElements"
              :key="item.id ?? index"
              class="h-full p-3 rounded-lg border border-slate-700 bg-slate-800/40"
              :style="{ borderColor: colorForElement(item, index).accent }"
            >
              <div class="text-sm font-semibold text-slate-200 line-clamp-2 flex items-start gap-2">
                <span
                  class="w-2 h-2 rounded-full mt-1.5 flex-none"
                  :style="{ backgroundColor: colorForElement(item, index).accent }"
                ></span>
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
type ElementColor = {
  accent: string
  highlight: string
}
type HighlightRange = {
  start: number
  end: number
  color: string
}
type HighlightSegment = {
  text: string
  color: string | null
}
const elementLandmarksById = ref<Record<string, ElementLandmark[]>>({})
const elementLandmarksLoadingById = ref<Record<string, boolean>>({})

const elementPalette: ElementColor[] = [
  { accent: '#f97316', highlight: 'rgba(249, 115, 22, 0.32)' },
  { accent: '#22c55e', highlight: 'rgba(34, 197, 94, 0.30)' },
  { accent: '#0ea5e9', highlight: 'rgba(14, 165, 233, 0.30)' },
  { accent: '#a855f7', highlight: 'rgba(168, 85, 247, 0.30)' },
  { accent: '#eab308', highlight: 'rgba(234, 179, 8, 0.30)' },
  { accent: '#ef4444', highlight: 'rgba(239, 68, 68, 0.28)' },
  { accent: '#14b8a6', highlight: 'rgba(20, 184, 166, 0.30)' },
  { accent: '#f43f5e', highlight: 'rgba(244, 63, 94, 0.28)' }
]

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
const traceRawText = computed(() => {
  const t = trace.value
  return String(t?.content || t?.title || 'Trace sans contenu')
})
const traceSplit = computed(() => {
  const raw = traceRawText.value
  const firstBreak = raw.indexOf('\n')
  if (firstBreak < 0) {
    return { first: raw, rest: '', restOffset: raw.length }
  }
  return {
    first: raw.slice(0, firstBreak),
    rest: raw.slice(firstBreak + 1),
    restOffset: firstBreak + 1
  }
})

const toExtractionText = (value: any): string => {
  if (typeof value === 'string') return value
  if (value == null || typeof value !== 'object') return ''
  const candidates = [value.extraction, value.text, value.value, value.content, value.title]
  for (const candidate of candidates) {
    if (typeof candidate === 'string') return candidate
  }
  return ''
}

const parseExtractionsFromContent = (content: string): string[] => {
  if (!content) return []
  const match = content.match(/Extractions\s*:\s*(\[[\s\S]*?\])/i)
  if (!match || !match[1]) return []

  const rawArrayBlock = match[1].trim()
  if (!rawArrayBlock.startsWith('[') || !rawArrayBlock.endsWith(']')) return []

  // 1) Try strict JSON parse first.
  try {
    const parsed = JSON.parse(rawArrayBlock)
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0)
    }
  } catch (_error) {
    // Ignore and fallback to a looser quoted-string extraction below.
  }

  // 2) Fallback: extract quoted strings inside the bracket block.
  const phrases: string[] = []
  const quotedStringRegex = /"((?:\\.|[^"\\])*)"/g
  let hit: RegExpExecArray | null = null
  while ((hit = quotedStringRegex.exec(rawArrayBlock)) !== null) {
    const normalized = hit[1].replace(/\\"/g, '"').trim()
    if (normalized.length > 0) phrases.push(normalized)
  }
  return phrases
}

const extractionPhrasesForElement = (item: any): string[] => {
  const seen = new Set<string>()
  const phrases: string[] = []

  const content = String(item?.content ?? item?.resource?.content ?? '')
  const contentExtractions = parseExtractionsFromContent(content)
  for (const phrase of contentExtractions) {
    const lowered = phrase.toLowerCase()
    if (seen.has(lowered)) continue
    seen.add(lowered)
    phrases.push(phrase)
  }

  // Fallback for older payloads with direct extractions arrays.
  if (phrases.length > 0) return phrases

  const raw = item?.extractions ?? item?.resource?.extractions ?? []
  const source = Array.isArray(raw) ? raw : [raw]
  for (const value of source) {
    const phrase = toExtractionText(value).trim()
    if (phrase.length < 2) continue
    const lowered = phrase.toLowerCase()
    if (seen.has(lowered)) continue
    seen.add(lowered)
    phrases.push(phrase)
  }
  return phrases
}

const elementColorById = computed<Record<string, ElementColor>>(() => {
  const map: Record<string, ElementColor> = {}
  simpleElements.value.forEach((item, index) => {
    const id = getElementId(item)
    if (!id) return
    map[id] = elementPalette[index % elementPalette.length]
  })
  return map
})

const colorForElement = (item: any, fallbackIndex = 0): ElementColor => {
  const id = getElementId(item)
  if (id && elementColorById.value[id]) return elementColorById.value[id]
  return elementPalette[fallbackIndex % elementPalette.length]
}

const highlightRanges = computed<HighlightRange[]>(() => {
  const text = traceRawText.value
  if (!text) return []
  const loweredTrace = text.toLowerCase()
  const foundRanges: Array<HighlightRange & { length: number }> = []
  const dedupe = new Set<string>()

  simpleElements.value.forEach((item, index) => {
    const phrases = extractionPhrasesForElement(item)
    if (phrases.length === 0) return
    const color = colorForElement(item, index).highlight
    for (const phrase of phrases) {
      const loweredPhrase = phrase.toLowerCase()
      let cursor = 0
      while (cursor < loweredTrace.length) {
        const hit = loweredTrace.indexOf(loweredPhrase, cursor)
        if (hit === -1) break
        const end = hit + loweredPhrase.length
        const key = `${hit}-${end}-${color}`
        if (!dedupe.has(key)) {
          foundRanges.push({ start: hit, end, color, length: loweredPhrase.length })
          dedupe.add(key)
        }
        cursor = end
      }
    }
  })

  foundRanges.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return b.length - a.length
  })

  const accepted: HighlightRange[] = []
  for (const candidate of foundRanges) {
    const overlaps = accepted.some((range) => !(candidate.end <= range.start || candidate.start >= range.end))
    if (!overlaps) {
      accepted.push({ start: candidate.start, end: candidate.end, color: candidate.color })
    }
  }
  return accepted.sort((a, b) => a.start - b.start)
})

const buildSegments = (text: string, globalOffset: number): HighlightSegment[] => {
  if (!text) return []
  const localStart = globalOffset
  const localEnd = globalOffset + text.length
  const ranges = highlightRanges.value
    .filter((range) => range.end > localStart && range.start < localEnd)
    .map((range) => ({
      start: Math.max(range.start, localStart) - localStart,
      end: Math.min(range.end, localEnd) - localStart,
      color: range.color
    }))
    .sort((a, b) => a.start - b.start)

  if (ranges.length === 0) return [{ text, color: null }]

  const segments: HighlightSegment[] = []
  let cursor = 0
  for (const range of ranges) {
    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), color: null })
    }
    segments.push({ text: text.slice(range.start, range.end), color: range.color })
    cursor = range.end
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), color: null })
  }
  return segments
}

const highlightedFirstSegments = computed(() => buildSegments(traceSplit.value.first, 0))
const highlightedRestSegments = computed(() => buildSegments(traceSplit.value.rest, traceSplit.value.restOffset))

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
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
