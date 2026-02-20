<template>
  <div>
    <!-- Lens Selection -->
    <div class="flex gap-3 overflow-x-auto pb-2 mb-4">
      <div
        v-for="lens in sortedLenses"
        :key="lens.id"
        @click="selectLens(lens)"
        :class="[
          'relative flex-shrink-0 px-4 py-3 pr-8 rounded-xl border cursor-pointer transition-all duration-200',
          currentLens?.id === lens.id
            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 text-slate-300'
        ]"
      >
        <button
          @click.stop="deleteLens(lens.id)"
          class="absolute top-2 right-2 p-0.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
          title="Supprimer cette lens"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
        <div class="text-sm font-medium">{{ lens.title || 'Lens ' + lens.id.slice(0, 8) }}</div>
        <div class="text-xs text-slate-500 mt-1">{{ formatDate(lens.created_at) }}</div>
      </div>
      
      <!-- Empty state -->
      <div
        v-if="!isLoadingLenses && sortedLenses.length === 0"
        class="flex-shrink-0 px-4 py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 text-sm"
      >
        Aucune lens disponible
      </div>
      
      <!-- Loading state -->
      <div
        v-if="isLoadingLenses"
        class="flex-shrink-0 px-4 py-3 text-slate-500 text-sm"
      >
        Chargement...
      </div>
    </div>

    <!-- Current Analysis Display -->
    <div v-if="currentLens" class="mt-4">
      <div v-if="isLoadingAnalysis" class="text-slate-500 text-sm">
        Chargement de l'analyse...
      </div>
      
      <router-link
        v-else-if="displayLandscapeAnalysis"
        :to="{ name: 'analysis', query: { id: displayLandscapeAnalysis.id } }"
        :title="displayTrace?.id ?? displayLandscapeAnalysis.id"
        class="relative block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 cursor-pointer hover:border-slate-600 hover:bg-slate-800/60 transition-colors"
      >
        <div
          v-if="isAnalysisProcessing"
          class="absolute top-4 right-4 flex items-center gap-2 text-amber-400 text-sm"
          title="Analyse en cours..."
        >
          <ArrowPathIcon class="w-5 h-5 animate-spin flex-shrink-0" />
          <span>En cours</span>
        </div>
        <div v-if="displayTrace" class="text-sm text-slate-400 mb-2">
          <h3 class="font-medium text-slate-300">{{ displayTrace.title || displayTrace.content || 'Trace' }}</h3>
          <span class="text-slate-500"> · {{ formatDate(displayTrace.interaction_date || displayTrace.created_at) }}</span>
        </div>
        <div v-if="displayLandscapeAnalysis.context" class="text-sm text-slate-400 whitespace-pre-line">
          {{ typeof displayLandscapeAnalysis.context === 'string' 
              ? displayLandscapeAnalysis.context 
              : JSON.stringify(displayLandscapeAnalysis.context, null, 2) }}
        </div>
        <div v-if="displayLandscapeAnalysis.content" class="text-sm text-slate-300 mt-2 whitespace-pre-line">
          {{ displayLandscapeAnalysis.content }}
        </div>
      </router-link>
      
      <div v-else-if="!currentLens.current_landscape_id" class="text-slate-500 text-sm">
        Cette lens n'a pas encore d'analyse associée.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLens, type Lens } from '@/composables/useLens'
import { useTrace } from '@/composables/useTrace'
import { XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const {
  lenses,
  currentLens,
  displayLandscapeAnalysis,
  isLoadingLenses,
  isLoadingAnalysis,
  loadUserLenses,
  selectLens,
  deleteLens
} = useLens()

const { traces, loadUserTraces } = useTrace()

const displayTrace = computed(() => {
  const analysis = displayLandscapeAnalysis.value
  if (!analysis?.analyzed_trace_id) return null
  return traces.value.find((t) => t.id === analysis.analyzed_trace_id) ?? null
})

const isAnalysisProcessing = computed(() => {
  const analysis = displayLandscapeAnalysis.value
  return analysis?.processing_state === 'drft'
})

const sortedLenses = computed(() => {
  return [...lenses.value].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA // Descending order
  })
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([loadUserLenses(), loadUserTraces()])
})
</script>
