<template>
  <div v-if="!analysis" class="text-center text-2xl pt-10">Loading...</div>
  <div v-else>
    <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Left: trace mirror content -->
      <section class="xl:col-span-1">
        <h3 class="text-xl font-bold mb-4">Trace miroir</h3>
        <div class="journal-canvas min-h-[420px]">
          <div class="traces-scroll h-full overflow-y-auto pr-2">
            <div class="paper-content">
              <template v-if="traceMirror">
                <div v-if="traceMirrorDate" class="text-xs text-slate-500 mb-2">
                  {{ formatDate(traceMirrorDate) }}
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
                  <div v-if="traceMirrorSplit.rest" class="font-georgia whitespace-pre-wrap">
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
              <div v-else class="text-sm text-slate-500">Aucune trace miroir</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: references -->
      <section class="xl:col-span-1 space-y-8 font-inter">
        <div>
          <h3 class="text-xl font-bold mb-4">Références détectées</h3>
          <div v-if="isLoadingReferences" class="text-sm text-slate-500">Chargement...</div>
          <div v-else-if="visibleReferences.length > 0" class="grid grid-cols-1 gap-3">
            <div
              v-for="(item, index) in visibleReferences"
              :key="itemId(item) ?? index"
              class="h-full p-3 rounded-lg border border-slate-700 bg-slate-800/40"
              :style="{ borderColor: colorForReference(item, index).accent }"
            >
              <div class="text-sm font-semibold text-slate-200 line-clamp-2 flex items-start gap-2">
                <span
                  class="w-2 h-2 rounded-full mt-1.5 flex-none"
                  :style="{ backgroundColor: colorForReference(item, index).accent }"
                ></span>
                {{ itemTitle(item) || 'Sans titre' }}
              </div>
              <div v-if="itemLandmarkSubtitle(item)" class="mt-1 text-xs text-slate-400">
                {{ itemLandmarkSubtitle(item) }}
              </div>
              <div v-if="itemDetailLines(item).length" class="mt-2 text-xs text-slate-300 whitespace-pre-wrap">
                <div
                  v-for="(line, lineIndex) in itemDetailLines(item)"
                  :key="`${itemId(item) ?? index}-detail-${lineIndex}`"
                >
                  {{ line }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-slate-500">Aucune référence</div>
          <button
            v-if="showSeeMoreReferences"
            type="button"
            class="mt-3 text-sm underline text-slate-400 hover:text-slate-200 transition-colors"
            @click="expandReferences = true"
          >
            voir plus
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'

const props = defineProps<{
  id: string
}>()

const analysis = ref<any>(null)
const traceMirror = ref<any>(null)
const references = ref<any[]>([])
const references_with_landmark = ref<any[]>([])
const landmarkTitleById = ref<Record<string, string>>({})
const landmarkById = ref<Record<string, any>>({})
const landmarkLoadingById = ref<Record<string, boolean>>({})
const isLoadingReferences = ref(false)
const expandReferences = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

type ReferenceColor = {
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

const referencePalette: ReferenceColor[] = [
  { accent: '#f97316', highlight: 'rgba(249, 115, 22, 0.32)' },
  { accent: '#22c55e', highlight: 'rgba(34, 197, 94, 0.30)' },
  { accent: '#0ea5e9', highlight: 'rgba(14, 165, 233, 0.30)' },
  { accent: '#a855f7', highlight: 'rgba(168, 85, 247, 0.30)' },
  { accent: '#eab308', highlight: 'rgba(234, 179, 8, 0.30)' },
  { accent: '#ef4444', highlight: 'rgba(239, 68, 68, 0.28)' },
  { accent: '#14b8a6', highlight: 'rgba(20, 184, 166, 0.30)' },
  { accent: '#f43f5e', highlight: 'rgba(244, 63, 94, 0.28)' }
]

const getTraceMirrorId = (value: any): string | null => {
  const id = value?.trace_mirror_id ?? value?.traceMirrorId
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const loadAnalysis = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}`)
    analysis.value = response.data?.analysis ?? response.data ?? null
  } catch (error) {
    console.error('Error fetching analysis:', error)
    analysis.value = null
  }
}

const loadTraceMirror = async (traceMirrorId: string) => {
  try {
    const response = await fetchWrapper.get(`/trace_mirrors/${traceMirrorId}`)
    traceMirror.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching trace mirror:', error)
    traceMirror.value = null
  }
}

const loadTraceMirrorReferences = async (traceMirrorId: string) => {
  isLoadingReferences.value = true
  try {
    const response = await fetchWrapper.get(`/trace_mirrors/${traceMirrorId}/references`)
    references.value = Array.isArray(response.data) ? response.data : []
    const landmarkIds = Array.from(
      new Set(
        references.value
          .map((item) => getLandmarkId(item))
          .filter((value): value is string => Boolean(value))
      )
    )
    await Promise.all(landmarkIds.map((landmarkId) => loadLandmarkTitle(landmarkId)))
    references_with_landmark.value = references.value.map((reference) => {
      const landmarkId = getLandmarkId(reference)
      const landmark = landmarkId ? (landmarkById.value[landmarkId] ?? null) : null
      return { ...reference, landmark }
    })
  } catch (error) {
    console.error('Error fetching trace mirror references:', error)
    references.value = []
    references_with_landmark.value = []
  } finally {
    isLoadingReferences.value = false
  }
}

const loadData = async () => {
  expandReferences.value = false
  references.value = []
  references_with_landmark.value = []
  traceMirror.value = null

  await loadAnalysis()
  const traceMirrorId = getTraceMirrorId(analysis.value)
  if (!traceMirrorId) return

  await Promise.all([
    loadTraceMirror(traceMirrorId),
    loadTraceMirrorReferences(traceMirrorId)
  ])
}

const traceMirrorDate = computed(() => {
  const item = traceMirror.value
  return item?.interaction_date ?? item?.interactionDate ?? item?.created_at ?? item?.createdAt ?? undefined
})

const traceMirrorRawText = computed(() => {
  const item = traceMirror.value
  return String(item?.content || item?.title || 'Trace miroir sans contenu')
})

const traceMirrorSplit = computed(() => {
  const raw = traceMirrorRawText.value
  const firstBreak = raw.indexOf('\n')
  if (firstBreak < 0) return { first: raw, rest: '', restOffset: raw.length }
  return {
    first: raw.slice(0, firstBreak),
    rest: raw.slice(firstBreak + 1),
    restOffset: firstBreak + 1
  }
})

const isLongFirstLine = computed(() => traceMirrorSplit.value.first.length > 200)

const cardsPerRow = computed(() => {
  if (viewportWidth.value >= 1280) return 3
  if (viewportWidth.value >= 768) return 2
  return 1
})

const visibleReferences = computed(() => {
  if (expandReferences.value) return references_with_landmark.value
  return references_with_landmark.value.slice(0, cardsPerRow.value)
})

const showSeeMoreReferences = computed(() => {
  return !expandReferences.value && references_with_landmark.value.length > cardsPerRow.value
})

const itemId = (item: any): string | null => {
  const id = item?.id ?? item?.resource?.id
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const getTagId = (item: any): string | null => {
  const id = item?.tag_id ?? item?.tagId
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const getLandmarkId = (item: any): string | null => {
  const id = item?.landmark_id ?? item?.landmarkId
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const loadLandmarkTitle = async (landmarkId: string) => {
  if (!landmarkId) return
  if (landmarkTitleById.value[landmarkId] != null) return
  if (landmarkLoadingById.value[landmarkId]) return
  landmarkLoadingById.value[landmarkId] = true
  try {
    const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
    const landmark = response.data ?? null
    landmarkById.value[landmarkId] = landmark
    landmarkTitleById.value[landmarkId] = landmark?.title ? String(landmark.title) : 'Landmark'
  } catch (error) {
    console.error(`Error fetching landmark ${landmarkId}:`, error)
    landmarkById.value[landmarkId] = null
    landmarkTitleById.value[landmarkId] = 'Landmark'
  } finally {
    landmarkLoadingById.value[landmarkId] = false
  }
}

const itemTitle = (item: any): string => item?.mention ?? item?.title ?? item?.resource?.title ?? ''
const itemMatchText = (item: any): string => {
  const mention = String(item?.mention ?? '').trim()
  const tagId = getTagId(item)
  if (!mention || !tagId) return ''
  return `${mention}[id:${tagId}]`
}
const itemLandmarkSubtitle = (item: any): string => {
  if (item?.landmark?.title) return String(item.landmark.title)
  const landmarkId = getLandmarkId(item)
  if (!landmarkId) return ''
  if (landmarkTitleById.value[landmarkId]) return landmarkTitleById.value[landmarkId]
  if (landmarkLoadingById.value[landmarkId]) return 'Chargement...'
  return ''
}

const toDisplayString = (value: any): string => {
  if (value == null) return ''
  if (Array.isArray(value)) {
    const serialized = value
      .map((entry) => toDisplayString(entry))
      .filter((entry) => entry.length > 0)
    return serialized.join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (_error) {
      return ''
    }
  }
  return String(value).trim()
}

const itemDetailLines = (item: any): string[] => {
  const tagId = toDisplayString(item?.tag_id ?? item?.tagId)
  const variants = toDisplayString(item?.reference_variants ?? item?.referenceVariants)
  const type = toDisplayString(item?.reference_type ?? item?.referenceType)
  const contextTag = toDisplayString(item?.context_tag ?? item?.contextTag)
  const landmarkId = toDisplayString(item?.landmark_id ?? item?.landmarkId)

  const lines: string[] = []
  if (tagId) lines.push(`tag_id: ${tagId}`)
  if (variants) lines.push(`reference_variants: ${variants}`)
  if (type) lines.push(`reference_type: ${type}`)
  if (contextTag) lines.push(`context_tag: ${contextTag}`)
  if (landmarkId) lines.push(`landmark_id: ${landmarkId}`)
  return lines
}

const referenceStableKey = (item: any): string | null => {
  const id = itemId(item)
  if (id) return id
  const mention = String(item?.mention ?? '').trim()
  const tagId = getTagId(item)
  if (!mention || !tagId) return null
  return `${mention}::${tagId}`
}

const referenceColorByKey = computed<Record<string, ReferenceColor>>(() => {
  const map: Record<string, ReferenceColor> = {}
  references_with_landmark.value.forEach((item, index) => {
    const key = referenceStableKey(item) ?? `__index_${index}`
    if (!map[key]) {
      map[key] = referencePalette[index % referencePalette.length]
    }
  })
  return map
})

const colorForReference = (item: any, fallbackIndex = 0): ReferenceColor => {
  const stableKey = referenceStableKey(item)
  if (stableKey && referenceColorByKey.value[stableKey]) return referenceColorByKey.value[stableKey]

  const dynamicIndex = references_with_landmark.value.findIndex((candidate) => candidate === item)
  if (dynamicIndex >= 0) {
    const dynamicKey = `__index_${dynamicIndex}`
    if (referenceColorByKey.value[dynamicKey]) return referenceColorByKey.value[dynamicKey]
    return referencePalette[dynamicIndex % referencePalette.length]
  }

  return referencePalette[fallbackIndex % referencePalette.length]
}

const highlightRanges = computed<HighlightRange[]>(() => {
  const text = traceMirrorRawText.value
  if (!text) return []

  const foundRanges: Array<HighlightRange & { length: number }> = []
  const dedupe = new Set<string>()
  const loweredText = text.toLowerCase()

  references_with_landmark.value.forEach((item, index) => {
    const pattern = itemMatchText(item)
    if (!pattern) return
    const color = colorForReference(item, index).highlight

    let cursor = 0
    let hasExactHit = false
    while (cursor < text.length) {
      const hit = text.indexOf(pattern, cursor)
      if (hit === -1) break
      hasExactHit = true
      const end = hit + pattern.length
      const key = `${hit}-${end}-${color}`
      if (!dedupe.has(key)) {
        foundRanges.push({ start: hit, end, color, length: pattern.length })
        dedupe.add(key)
      }
      cursor = end
    }

    // Fallback to case-insensitive match when tagged text differs only by case.
    if (!hasExactHit) {
      const loweredPattern = pattern.toLowerCase()
      let loweredCursor = 0
      while (loweredCursor < loweredText.length) {
        const hit = loweredText.indexOf(loweredPattern, loweredCursor)
        if (hit === -1) break
        const end = hit + loweredPattern.length
        const key = `${hit}-${end}-${color}`
        if (!dedupe.has(key)) {
          foundRanges.push({ start: hit, end, color, length: loweredPattern.length })
          dedupe.add(key)
        }
        loweredCursor = end
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

const highlightedFirstSegments = computed(() => buildSegments(traceMirrorSplit.value.first, 0))
const highlightedRestSegments = computed(() => buildSegments(traceMirrorSplit.value.rest, traceMirrorSplit.value.restOffset))

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const updateViewportWidth = () => {
  if (typeof window === 'undefined') return
  viewportWidth.value = window.innerWidth
}

onMounted(async () => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
  await loadData()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
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
