<template>
  <div>
    <h2 class="text-lg font-semibold mb-1 text-slate-200">Vos journaux</h2>
    <span class="text-xs text-slate-500">Consultez ce que vous avez écrit et ajoutez de nouvelles traces</span>

    <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="journal in sortedJournals"
        :key="journal.id"
        type="button"
        @click="selectJournal(journal)"
        :class="[
          'px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-colors',
          currentJournalId === (journal.resource_id ?? journal.resource?.id)
            ? 'border-blue-500 bg-blue-500/20 text-blue-200'
            : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
        ]"
      >
        {{ journal.resource?.title || 'Sans titre' }}
      </button>
    </div>

    <div class="mt-4">
      <div v-if="isLoading" class="text-sm text-slate-500">Chargement...</div>
      <div v-else-if="!currentJournal" class="text-sm text-slate-500">Aucun journal trouvé</div>
      <div v-else>
        <textarea
          v-model="newTraceContent"
          rows="3"
          placeholder="Écrire une nouvelle trace..."
          class="w-full mb-4 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-200 text-sm p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div v-if="journalTraces.length > 0" class="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          <div v-for="trace in journalTraces" :key="trace.id" class="text-sm text-slate-300 whitespace-pre-line">
            <div class="text-xs text-slate-500 mb-1">
              {{ formatDate(trace.interaction_date || trace.created_at) }}
            </div>
            <div>{{ trace.content || trace.title || 'Trace sans contenu' }}</div>
          </div>
        </div>
        <div v-else class="text-sm text-slate-500">
          Aucune trace pour ce journal
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useJournal } from '@/composables/useJournal'
import { useTrace } from '@/composables/useTrace'
import { type ApiInteraction, type ApiTrace } from '@/types/models'

const { userJournals, loadUserJournal } = useJournal()
const { traces, loadUserTraces } = useTrace()

const isLoading = ref(false)
const newTraceContent = ref('')

const sortedJournals = computed<ApiInteraction[]>(() => {
  if (!userJournals.value.length) return []
  return [...userJournals.value].sort((a, b) => {
    const aDate = new Date(
      (a.resource?.created_at as any) || (a.created_at as any) || 0
    ).getTime()
    const bDate = new Date(
      (b.resource?.created_at as any) || (b.created_at as any) || 0
    ).getTime()
    return aDate - bDate
  })
})

const currentJournal = ref<ApiInteraction | null>(null)

const currentJournalId = computed(() => {
  return currentJournal.value?.resource_id ?? currentJournal.value?.resource?.id ?? null
})

const selectJournal = (journal: ApiInteraction) => {
  currentJournal.value = journal
}

const journalTraces = computed<ApiTrace[]>(() => {
  const journalId = currentJournalId.value
  if (!journalId) return []
  const filtered = traces.value.filter((t) => t.journal_id === journalId)
  return [...filtered].sort((a, b) => {
    const aDate = new Date(a.interaction_date || a.created_at || 0).getTime()
    const bDate = new Date(b.interaction_date || b.created_at || 0).getTime()
    return bDate - aDate
  })
})

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

watch(sortedJournals, (list) => {
  if (!list.length) {
    currentJournal.value = null
    return
  }
  const currentId = currentJournalId.value
  const stillExists = list.find((j) => (j.resource_id ?? j.resource?.id) === currentId)
  if (!stillExists) {
    currentJournal.value = list[0]
  }
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([loadUserJournal(), loadUserTraces()])
    if (!currentJournal.value && sortedJournals.value.length > 0) {
      currentJournal.value = sortedJournals.value[0]
    }
  } finally {
    isLoading.value = false
  }
})
</script>
