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
                  <div
                    :class="[
                      'mb-2 text-slate-800 whitespace-pre-wrap',
                      isLongFirstLine ? 'font-georgia text-lg leading-relaxed' : 'font-handwritten text-4xl leading-tight'
                    ]"
                  >
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
          <div class="space-y-3">
            <div v-for="section in elementSections" :key="section.key">
              <button
                type="button"
                class="w-full flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 hover:bg-slate-800/60 transition-colors"
                @click="toggleSection(section.key)"
              >
                <span class="text-xs uppercase tracking-wide text-slate-300 font-semibold">
                  {{ section.title }}
                </span>
                <span class="inline-flex items-center gap-2">
                  <span class="text-xs text-slate-400">{{ section.items.length }}</span>
                  <ChevronDownIcon
                    class="w-4 h-4 text-slate-400 transition-transform"
                    :class="expandedCategory === section.key ? 'rotate-180' : ''"
                  />
                </span>
              </button>
              <div v-if="expandedCategory === section.key" class="mt-2 pl-1">
                <div v-if="section.items.length > 0" class="grid grid-cols-1 gap-3">
                  <ElementDisplayCard
                    v-for="(item, index) in section.items"
                    :key="item.id ?? `${section.key}-${index}`"
                    :element="item"
                    :accent-color="colorForElement(item, index).accent"
                    :associated-landmarks="elementLandmarksById[getElementId(item) || ''] ?? []"
                  />
                </div>
                <div v-else class="text-xs text-slate-500">Aucun élément</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { fetchWrapper } from '@/helpers'
import ElementDisplayCard from '@/components/Element/ElementDisplayCard.vue'

const props = defineProps<{
  id: string
}>()

const analysis = ref<any>(null)
const trace = ref<any>(null)
const elements = ref<any[]>([])
const expandedCategory = ref<ElementSectionKey | null>(null)
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
    const response = await fetchWrapper.get(`/trace_mirrors/${traceId}`)
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

type ElementSectionKey = 'transactions' | 'descriptives' | 'evaluatives' | 'normatives'

const decodeElementContentObject = (item: any): Record<string, any> | null => {
  const raw = item?.content ?? item?.resource?.content
  if (typeof raw !== 'string') return null
  let current: any = raw.trim()
  if (!current) return null

  for (let depth = 0; depth < 3; depth++) {
    if (typeof current !== 'string') break
    const trimmed = current.trim()
    if (!trimmed) return null
    const startsLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')
    if (!startsLikeJson) return null
    try {
      current = JSON.parse(trimmed)
    } catch (_error) {
      return null
    }
  }

  if (current && typeof current === 'object' && !Array.isArray(current)) {
    return current as Record<string, any>
  }
  return null
}

const categoryFromTypeName = (value: unknown): ElementSectionKey | null => {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) return null

  if (normalized === 'transaction' || normalized.startsWith('transaction')) return 'transactions'
  if (normalized === 'descriptive' || normalized.startsWith('descriptive')) return 'descriptives'
  if (normalized === 'evaluative' || normalized.startsWith('evaluative')) return 'evaluatives'
  if (normalized === 'normative' || normalized.startsWith('normative')) return 'normatives'
  return null
}

const categoryFromSubtype = (value: unknown): ElementSectionKey | null => {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (!normalized) return null

  if (['input', 'output', 'transformation', 'question'].includes(normalized)) return 'transactions'
  if (['unit', 'theme'].includes(normalized)) return 'descriptives'
  if (['emotion', 'energy', 'quality', 'interest'].includes(normalized)) return 'evaluatives'
  if (['plan', 'obligation', 'recommendation', 'principle'].includes(normalized)) return 'normatives'
  return null
}

const getElementCategory = (item: any): ElementSectionKey | null => {
  const decoded = decodeElementContentObject(item)

  const typeCandidates = [
    item?.element_type,
    item?.elementType,
    item?.resource?.element_type,
    item?.resource?.elementType,
    decoded?.element_type,
    decoded?.elementType,
    decoded?.type
  ]
  for (const candidate of typeCandidates) {
    const category = categoryFromTypeName(candidate)
    if (category) return category
  }

  const subtypeCandidates = [
    item?.element_subtype,
    item?.elementSubtype,
    item?.resource?.element_subtype,
    item?.resource?.elementSubtype,
    decoded?.element_subtype,
    decoded?.elementSubtype,
    decoded?.subtype,
    decoded?.kind
  ]
  for (const candidate of subtypeCandidates) {
    const category = categoryFromSubtype(candidate)
    if (category) return category
  }

  return null
}

const transactionElements = computed(() => {
  return elements.value.filter((item: any) => getElementCategory(item) === 'transactions')
})

const descriptiveElements = computed(() => {
  return elements.value.filter((item: any) => getElementCategory(item) === 'descriptives')
})

const evaluativeElements = computed(() => {
  return elements.value.filter((item: any) => getElementCategory(item) === 'evaluatives')
})

const normativeElements = computed(() => {
  return elements.value.filter((item: any) => getElementCategory(item) === 'normatives')
})

const elementSections = computed(() => {
  return [
    { key: 'transactions', title: 'Transactions', items: transactionElements.value },
    { key: 'descriptives', title: 'Descriptives', items: descriptiveElements.value },
    { key: 'evaluatives', title: 'Evaluatives', items: evaluativeElements.value },
    { key: 'normatives', title: 'Normatives', items: normativeElements.value }
  ]
})

const displayedElements = computed(() => {
  if (!expandedCategory.value) return []
  const section = elementSections.value.find((item) => item.key === expandedCategory.value)
  return section?.items ?? []
})

const toggleSection = (key: ElementSectionKey) => {
  expandedCategory.value = expandedCategory.value === key ? null : key
}

const traceInteractionDate = computed(() => {
  const t = trace.value
  return t?.interaction_date ?? t?.interactionDate ?? t?.created_at ?? t?.createdAt ?? undefined
})

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
const isLongFirstLine = computed(() => traceSplit.value.first.length > 200)

const toExtractionText = (value: any): string => {
  if (typeof value === 'string') return value
  if (value == null || typeof value !== 'object') return ''
  const candidates = [value.extraction, value.text, value.value, value.content, value.title]
  for (const candidate of candidates) {
    if (typeof candidate === 'string') return candidate
  }
  return ''
}

const decodeJsonEncodedContent = (content: string): any | null => {
  if (!content) return null
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

const spanTextCandidates = (value: any): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => spanTextCandidates(entry))
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
  }
  if (value == null || typeof value !== 'object') return []

  const candidates = [value.text, value.value, value.content, value.extraction, value.title]
  const found: string[] = []
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      found.push(candidate.trim())
    } else if (Array.isArray(candidate)) {
      found.push(...spanTextCandidates(candidate))
    }
  }
  return found
}

const collectSpanPhrases = (value: any, out: string[]) => {
  if (value == null) return
  if (Array.isArray(value)) {
    for (const entry of value) collectSpanPhrases(entry, out)
    return
  }
  if (typeof value !== 'object') return

  if ('spans' in value) {
    out.push(...spanTextCandidates((value as any).spans))
  } else if ('span' in value) {
    out.push(...spanTextCandidates((value as any).span))
  }

  for (const nested of Object.values(value)) {
    if (nested == null || typeof nested !== 'object') continue
    collectSpanPhrases(nested, out)
  }
}

const parseSpanPhrasesFromContent = (content: string): string[] => {
  const decoded = decodeJsonEncodedContent(content)
  if (decoded == null) return []

  const found: string[] = []
  collectSpanPhrases(decoded, found)

  const seen = new Set<string>()
  const unique: string[] = []
  for (const phrase of found) {
    const normalized = phrase.trim()
    if (normalized.length < 2) continue
    const lowered = normalized.toLowerCase()
    if (seen.has(lowered)) continue
    seen.add(lowered)
    unique.push(normalized)
  }
  return unique
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
  const contentSpans = parseSpanPhrasesFromContent(content)
  for (const phrase of contentSpans) {
    const lowered = phrase.toLowerCase()
    if (seen.has(lowered)) continue
    seen.add(lowered)
    phrases.push(phrase)
  }

  // New payload: spans-based matching extracted from JSON-encoded content.
  if (phrases.length > 0) return phrases

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
  displayedElements.value.forEach((item, index) => {
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

  displayedElements.value.forEach((item, index) => {
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
  () => displayedElements.value.map((item) => getElementId(item)).filter(Boolean).join(','),
  async () => {
    const elementIds = displayedElements.value
      .map((item) => getElementId(item))
      .filter((value): value is string => Boolean(value))
    await Promise.all(elementIds.map((elementId) => loadElementLandmarks(elementId)))
  },
  { immediate: true }
)

const getTraceMirrorId = (a: any): string | null => {
  if (!a) return null
  const id = a.trace_mirror_id ?? a.traceMirrorId
  if (id == null) return null
  const s = String(id).trim()
  return s.length > 0 ? s : null
}

const loadData = async () => {
  expandedCategory.value = null
  elementLandmarksById.value = {}
  elementLandmarksLoadingById.value = {}
  elements.value = []
  trace.value = null
  await loadAnalysis()
  const a = analysis.value
  if (a) {
    const traceMirrorId = getTraceMirrorId(a)
    if (traceMirrorId) {
      await loadTrace(traceMirrorId)
    }
  }

  await loadAnalysisElements()
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
