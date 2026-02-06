<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 text-slate-200">Dernières traces</h2>
    
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
      <div class="flex items-start gap-6 overflow-x-auto py-4 pt-10">
        <!-- Each trace as a commit-like item -->
        <div
          v-for="(trace, index) in sortedTraces"
          :key="trace.id"
          class="trace-item flex flex-col items-center flex-shrink-0 relative group"
          style="min-width: 120px;"
        >
          <!-- Red arrow down icon above selected trace -->
          <div
            v-if="isCurrentHeadTrace(trace)"
            class="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center"
          >
            <ArrowDownIcon class="w-6 h-6 text-red-500 drop-shadow-lg" />
          </div>
          
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
              @click.stop="handleTraceClick(trace)"
            >
              <PlayIcon class="w-4 h-4" />
            </button>
            <!-- Rounded icon/circle -->
            <div
              :class="[
                'w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:scale-110 transition-transform relative z-10',
                `bg-gradient-to-br ${getJournalColor(trace).from} ${getJournalColor(trace).to}`,
                getJournalColor(trace).border,
                hasFinishedAnalysis(trace) ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900' : (getParentForTrace(trace) ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : '')
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTrace } from '@/composables/useTrace'
import { useJournal } from '@/composables/useJournal'
import { useLens } from '@/composables/useLens'
import { type ApiTrace } from '@/types/models'
import { ArrowDownIcon, PlayIcon } from '@heroicons/vue/24/outline'

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
    return dateB - dateA // Descending order (most recent first)
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

// Get the current trace (the one matching display analysis)
const currentTrace = computed(() => {
  const id = displayLandscapeAnalysis.value?.analyzed_trace_id
  if (!id) return null
  return sortedTraces.value.find((t) => t.id === id) ?? null
})

// Play button visible only when trace is not older than current landscape analysis trace
const canShowPlayButton = (trace: ApiTrace): boolean => {
  const current = currentTrace.value
  if (!current) return true
  return getTraceDate(trace) >= getTraceDate(current)
}

// Handle play click: for currently pointed trace, PUT lens with processing_state 'rply'; else PUT target_trace_id
const handleTraceClick = async (trace: ApiTrace) => {
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
