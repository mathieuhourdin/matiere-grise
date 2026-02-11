<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoadingTraces" class="text-slate-500 text-sm">
      Chargement...
    </div>
    
    <!-- Empty state -->
    <div
      v-else-if="!isLoadingTraces && sortedTraces.length === 0"
      class="text-slate-500 text-sm"
    >
      Aucune trace disponible
    </div>
    
    <!-- Traces display - GitHub commit style -->
    <div v-else class="relative">

      <div class="relative">
        <div class="mt-2 flex items-center justify-between px-1">
          <button
            v-if="canScrollLeft"
            type="button"
            class="h-5 w-5 flex items-center justify-center text-slate-500 hover:text-slate-300"
            title="Défiler à gauche"
            @click="scrollTimelineBy(-1)"
          >
            <ChevronLeftIcon class="w-5 h-5" />
          </button>

          <div v-else class="h-5 w-5"></div>
          <div class="flex-1"></div>
          <button
            v-if="canScrollRight"
            type="button"
            class="h-5 w-5 flex items-center justify-center text-slate-500 hover:text-slate-300"
            title="Défiler à droite"
            @click="scrollTimelineBy(1)"
          >
            <ChevronRightIcon class="w-5 h-5" />
          </button>
          <div v-else class="h-5 w-5"></div>
        </div>

        <div class="relative">
          <div
            v-if="canScrollLeft"
            class="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-white/95 to-transparent dark:from-gray-900/90"
          ></div>
          <div
            v-if="canScrollRight"
            class="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-white/95 to-transparent dark:from-gray-900/90"
          ></div>

      <div ref="scrollContainer" class="flex items-start gap-6 overflow-x-auto pb-4" @scroll="updateScrollAffordances">
        <!-- Each trace as a commit-like item -->
        <div
          v-for="(trace, index) in sortedTraces"
          :key="trace.id"
          :ref="(el) => setTraceEl(trace.id, el)"
          class="trace-item flex flex-col items-center flex-shrink-0 relative group"
          style="min-width: 120px;"
        >
          <!-- Connection line to the right (except for last item) -->
          <div
            v-if="index < sortedTraces.length - 1"
            class="absolute top-12 left-12 h-0.5 bg-slate-700 z-0"
            style="width: calc(100% + 1.5rem);"
          ></div>
          
          <!-- Play + circle block: padding creates hoverable gap so hover is maintained between them -->
          <div class="relative pt-6 flex flex-col items-center">
            <!-- Play picto (visible on hover when trace not older than current analysis trace) -->
            <button
              v-if="canShowPlayButton(trace)"
              type="button"
              class="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              :title="'Voir l\'analyse'"
              @click.stop="handlePlayTraceAnalysisClick(trace)"
            >
              <PlayIcon class="w-4 h-4" />
            </button>
            <!-- Rounded icon/circle -->
            <div
              :class="[
                'w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:scale-110 transition-transform relative z-10',
                `bg-gradient-to-br ${getJournalColor(trace).from} ${getJournalColor(trace).to}`,
                getJournalColor(trace).border,
                isCurrentHeadTrace(trace)
                  ? 'ring-4 ring-amber-300 ring-offset-4 ring-offset-slate-900 shadow-[0_0_22px_rgba(251,191,36,0.95)]'
                  : (hasFinishedAnalysis(trace)
                    ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900'
                    : (getParentForTrace(trace) ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : ''))
              ]"
              :title="trace.content || getTraceTitle(trace)"
            >
              <span v-if="trace.title">
                {{ trace.title.charAt(0).toUpperCase() }}
              </span>
              <span v-else-if="trace.content">
                {{ trace.content.charAt(0).toUpperCase() }}
              </span>
              <span v-else>T</span>
            </div>
          </div>
          
          <!-- Title below the circle -->
          <div class="mt-2 text-center max-w-[120px] group-hover:max-w-none transition-all duration-300">
            <div
              class="text-sm font-medium text-slate-300 truncate group-hover:whitespace-normal group-hover:break-words"
              :title="trace.content || getTraceTitle(trace)"
            >
              {{ getTraceTitle(trace) }}
            </div>
            <div
              v-if="getJournalTitle(trace)"
              class="text-xs text-slate-400 truncate mt-0.5 group-hover:whitespace-normal group-hover:break-words"
              :title="getJournalTitle(trace) ?? undefined"
            >
              {{ getJournalTitle(trace) }}
            </div>
            <div class="text-xs text-slate-500 mt-1">
              {{ formatDate(trace.interaction_date || trace.created_at) }}
            </div>
          </div>
        </div>
        <div
          v-if="trailingSpacerWidth > 0"
          class="flex-shrink-0"
          :style="{ width: `${trailingSpacerWidth}px` }"
        ></div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { useTrace } from '@/composables/useTrace'
import { useJournal } from '@/composables/useJournal'
import { useLens } from '@/composables/useLens'
import { type ApiTrace } from '@/types/models'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/vue/24/outline'

const {
  traces,
  isLoadingTraces,
  loadUserTraces
} = useTrace()

const {
  userJournals,
  loadUserJournal
} = useJournal()

const {
  currentLens,
  displayLandscapeAnalysis,
  headLandscapeAnalysis,
  headLandscapeAnalysisParents,
  updateDisplayLandscapeAnalysis,
  updateLensCurrentTrace,
  updateLensProcessingState,
  createLens,
  loadUserLenses
} = useLens()

const sortedTraces = computed(() => {
  return [...traces.value].sort((a, b) => {
    const dateA = new Date(a.interaction_date || a.created_at || 0).getTime()
    const dateB = new Date(b.interaction_date || b.created_at || 0).getTime()
    return dateA - dateB // Ascending order (oldest first)
  })
})

const getTraceTitle = (trace: ApiTrace): string => {
  if (trace.title) return trace.title
  if (trace.content) {
    // Extract first line or first 30 characters as title
    const firstLine = trace.content.split('\n')[0].trim()
    return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine
  }
  return 'Trace ' + trace.id.slice(0, 8)
}

const getJournalTitle = (trace: ApiTrace): string | null => {
  if (!trace.journal_id) return null
  
  // Match trace journal_id to journal resource_id
  const journal = userJournals.value.find(
    (journal) => journal.resource_id === trace.journal_id
  )
  
  return journal?.resource?.title || null
}

const isCurrentHeadTrace = (trace: ApiTrace): boolean => {
  return displayLandscapeAnalysis.value?.analyzed_trace_id === trace.id
}

// Color palette for journals
const journalColors = [
  { from: 'from-blue-500', to: 'to-cyan-600', border: 'border-blue-400' },
  { from: 'from-purple-500', to: 'to-pink-600', border: 'border-purple-400' },
  { from: 'from-indigo-500', to: 'to-blue-600', border: 'border-indigo-400' },
  { from: 'from-rose-500', to: 'to-red-600', border: 'border-rose-400' },
  { from: 'from-amber-500', to: 'to-orange-600', border: 'border-amber-400' },
  { from: 'from-emerald-500', to: 'to-teal-600', border: 'border-emerald-400' },
  { from: 'from-violet-500', to: 'to-purple-600', border: 'border-violet-400' },
  { from: 'from-sky-500', to: 'to-blue-600', border: 'border-sky-400' },
  { from: 'from-fuchsia-500', to: 'to-pink-600', border: 'border-fuchsia-400' },
  { from: 'from-lime-500', to: 'to-green-600', border: 'border-lime-400' },
]

// Simple hash function to get consistent color for journal_id
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

const getJournalColor = (trace: ApiTrace) => {
  // If it's the current head trace, return green
  if (isCurrentHeadTrace(trace)) {
    return {
      from: 'from-green-500',
      to: 'to-emerald-600',
      border: 'border-green-400'
    }
  }
  
  // If no journal_id, return default blue-purple
  if (!trace.journal_id) {
    return {
      from: 'from-blue-500',
      to: 'to-purple-600',
      border: 'border-slate-800'
    }
  }
  
  // Get consistent color based on journal_id
  const hash = hashString(trace.journal_id)
  const colorIndex = hash % journalColors.length
  return journalColors[colorIndex]
}

// Find the landscape analysis that has this trace as analyzed_trace_id
const getLandscapeAnalysisForTrace = (trace: ApiTrace) => {
  if (displayLandscapeAnalysis.value?.analyzed_trace_id === trace.id) {
    return displayLandscapeAnalysis.value
  }
  if (headLandscapeAnalysis.value?.analyzed_trace_id === trace.id) {
    return headLandscapeAnalysis.value
  }
  return headLandscapeAnalysisParents.value.find(
    (parent) => parent.analyzed_trace_id === trace.id
  ) ?? null
}

const hasFinishedAnalysis = (trace: ApiTrace): boolean => {
  return getLandscapeAnalysisForTrace(trace)?.processing_state === 'fnsh'
}

// Find parent analysis that matches this trace
const getParentForTrace = (trace: ApiTrace) => {
  return headLandscapeAnalysisParents.value.find(
    (parent) => parent.analyzed_trace_id === trace.id
  )
}

const getTraceDate = (trace: ApiTrace): number => {
  const date = trace.interaction_date ?? trace.created_at
  return date ? new Date(date).getTime() : 0
}

const scrollContainer = ref<HTMLElement | null>(null)
const traceEls = ref<Record<string, HTMLElement | null>>({})
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const trailingSpacerWidth = ref(0)
const traceCardMinWidth = 120

const setTraceEl = (id: string, el: Element | null) => {
  traceEls.value[id] = el as HTMLElement | null
}

const updateTrailingSpacerWidth = () => {
  const container = scrollContainer.value
  if (!container) {
    trailingSpacerWidth.value = 0
    return
  }
  trailingSpacerWidth.value = Math.max(
    0,
    Math.round(container.clientWidth / 2 - traceCardMinWidth / 2)
  )
}

const updateScrollAffordances = () => {
  const container = scrollContainer.value
  if (!container) {
    canScrollLeft.value = false
    canScrollRight.value = false
    trailingSpacerWidth.value = 0
    return
  }
  updateTrailingSpacerWidth()
  const hasOverflow = container.scrollWidth - container.clientWidth > 1
  if (!hasOverflow) {
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }
  canScrollLeft.value = container.scrollLeft > 1
  canScrollRight.value = container.scrollLeft + container.clientWidth < container.scrollWidth - 1
}

// Get the current trace (the one matching display analysis)
const currentTrace = computed(() => {
  const id = displayLandscapeAnalysis.value?.analyzed_trace_id
  if (!id) return null
  return sortedTraces.value.find((t) => t.id === id) ?? null
})
const todayTrace = computed(() => {
  if (sortedTraces.value.length === 0) return null
  return sortedTraces.value[sortedTraces.value.length - 1] ?? null
})

// Play button visible only when trace is not older than current landscape analysis trace
const canShowPlayButton = (trace: ApiTrace): boolean => {
  const current = currentTrace.value
  if (!current) return true
  return getTraceDate(trace) >= getTraceDate(current)
}

const scrollToTrace = async (traceId: string | null | undefined) => {
  if (!traceId) return
  await nextTick()
  const el = traceEls.value[traceId]
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  requestAnimationFrame(updateScrollAffordances)
}

const centerOnCurrentTrace = async () => {
  await scrollToTrace(currentTrace.value?.id)
}

const scrollToFocus = async () => {
  await scrollToTrace(currentTrace.value?.id)
}

const scrollToToday = async () => {
  await nextTick()
  const container = scrollContainer.value
  if (!container) return
  updateTrailingSpacerWidth()
  container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
  requestAnimationFrame(updateScrollAffordances)
}

const scrollTimelineBy = (direction: -1 | 1) => {
  const container = scrollContainer.value
  if (!container) return
  const amount = Math.max(220, Math.round(container.clientWidth * 0.7))
  container.scrollBy({ left: amount * direction, behavior: 'smooth' })
  requestAnimationFrame(updateScrollAffordances)
}

// Handle play click: for currently pointed trace, PUT lens with processing_state 'rply'; else PUT target_trace_id
const handlePlayTraceAnalysisClick = async (trace: ApiTrace) => {
  if (isCurrentHeadTrace(trace)) {
    if (currentLens.value) {
      await updateLensProcessingState('rply')
    }
    return
  }

  if (currentLens.value) {
    await updateLensCurrentTrace(trace.id)
  } else {
    await createLens(trace.id)
    await loadUserLenses()
  }

  const parent = getParentForTrace(trace)
  if (parent) {
    updateDisplayLandscapeAnalysis(parent.id)
  }
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short'
  })
}

onMounted(async () => {
  await Promise.all([
    loadUserTraces(),
    loadUserJournal()
  ])
  await nextTick()
  updateScrollAffordances()
  await centerOnCurrentTrace()
  window.addEventListener('resize', updateScrollAffordances)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollAffordances)
})

watch(
  () => sortedTraces.value.map((trace) => trace.id).join(','),
  async () => {
    await nextTick()
    updateScrollAffordances()
  }
)

watch(currentTrace, async (newTrace, oldTrace) => {
  if (newTrace?.id && newTrace.id !== oldTrace?.id) {
    await centerOnCurrentTrace()
    updateScrollAffordances()
  }
})

const hasFocusTarget = () => Boolean(currentTrace.value)
const hasTodayTarget = () => Boolean(todayTrace.value)

defineExpose({
  scrollToFocus,
  scrollToToday,
  hasFocusTarget,
  hasTodayTarget
})
</script>

<style scoped>
/* Hide scrollbars while maintaining scroll functionality */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Expand trace item on hover */
.trace-item:hover {
  min-width: 250px;
  z-index: 30;
}

.trace-item:hover .max-w-\[120px\] {
  max-width: 250px;
}
</style>
