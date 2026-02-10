<template>
  <section :class="['ipad-shell', { 'ipad-shell-fullscreen': fullscreen }]">
    <div class="ipad-screen">
      <header class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Vos journaux</h2>
          <p class="text-xs text-slate-500">Consultez ce que vous avez ecrit et ajoutez de nouvelles traces</p>
        </div>
        <router-link
          v-if="!fullscreen"
          to="/me/journal-pad"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 bg-white/80 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors"
          title="Ouvrir en plein écran"
          aria-label="Ouvrir le journal en plein écran"
        >
          <ArrowTopRightOnSquareIcon class="w-4 h-4" />
        </router-link>
      </header>

      <div class="journal-tabs flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="journal in sortedJournals"
          :key="journal.id"
          type="button"
          @click="selectJournal(journal)"
          :class="[
            'px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all duration-200 shadow-sm',
            currentJournalId === (journal.resource_id ?? journal.resource?.id)
              ? 'border-sky-500 bg-sky-100 text-sky-900'
              : 'border-slate-300 bg-white/80 text-slate-600 hover:border-slate-400'
          ]"
        >
          {{ journal.resource?.title || 'Sans titre' }}
        </button>
      </div>

      <div class="mt-4 flex-1 min-h-0">
        <div v-if="isLoading" class="text-sm text-slate-500">Chargement...</div>
        <div v-else-if="!currentJournal" class="text-sm text-slate-500">Aucun journal trouve</div>
        <div v-else class="journal-canvas h-full">
          <div class="traces-scroll flex-1 min-h-0 overflow-y-auto pr-2">
            <div class="paper-content space-y-6">
              <textarea
                v-model="newTraceContent"
                rows="3"
                placeholder="Ecrire une nouvelle trace..."
                class="w-full rounded-xl border border-amber-200 bg-white/75 text-slate-700 text-base p-4 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 font-handwritten"
              ></textarea>

              <div v-if="isLoadingJournalTraces" class="text-sm text-slate-500">
                Chargement des traces...
              </div>
              <template v-else-if="journalTraces.length > 0">
                <article
                  v-for="trace in journalTraces"
                  :key="trace.id"
                  class="trace-entry text-[17px] text-slate-700 whitespace-pre-line leading-[2]"
                >
                  <div class="text-xs text-slate-500 mb-1">
                    {{ formatDate(trace.interaction_date || trace.created_at) }}
                  </div>
                  <div class="font-handwritten text-4xl mb-2 leading-tight text-slate-800">
                    {{ splitTraceText(trace).first }}
                  </div>
                  <div v-if="splitTraceText(trace).rest" class="font-georgia">
                    {{ splitTraceText(trace).rest }}
                  </div>
                </article>
              </template>
              <div v-else class="text-sm text-slate-500">
                Aucune trace pour ce journal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ipad-home-indicator"></div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useJournal } from '@/composables/useJournal'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar'
import { type ApiInteraction, type ApiTrace } from '@/types/models'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

withDefaults(defineProps<{
  fullscreen?: boolean
}>(), {
  fullscreen: false
})

const { userJournals, loadUserJournal } = useJournal()
const { launchSnackbar } = useSnackbar()

const isLoading = ref(false)
const isLoadingJournalTraces = ref(false)
const newTraceContent = ref('')
const journalTraces = ref<ApiTrace[]>([])
let tracesRequestToken = 0

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

const loadTracesForJournal = async (journalId: string) => {
  const token = ++tracesRequestToken
  isLoadingJournalTraces.value = true
  try {
    const response = await fetchWrapper.get(`/journals/${journalId}/traces`)
    if (token !== tracesRequestToken) return
    const list = Array.isArray(response.data) ? response.data : []
    journalTraces.value = list
  } catch (error) {
    if (token !== tracesRequestToken) return
    console.error('Error loading traces for journal:', error)
    launchSnackbar(`Error loading journal traces: ${error}`, 'error')
    journalTraces.value = []
  } finally {
    if (token !== tracesRequestToken) return
    isLoadingJournalTraces.value = false
  }
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const splitTraceText = (trace: ApiTrace) => {
  const raw = trace.content || trace.title || 'Trace sans contenu'
  const lines = raw.split('\n')
  const first = lines.shift() ?? ''
  const rest = lines.join('\n').trim()
  return { first, rest }
}

watch(sortedJournals, (list) => {
  if (!list.length) {
    currentJournal.value = null
    journalTraces.value = []
    return
  }
  const currentId = currentJournalId.value
  const stillExists = list.find((j) => (j.resource_id ?? j.resource?.id) === currentId)
  if (!stillExists) {
    currentJournal.value = list[0]
  }
})

watch(currentJournalId, async (journalId) => {
  if (!journalId) {
    journalTraces.value = []
    return
  }
  journalTraces.value = []
  await loadTracesForJournal(journalId)
})

onMounted(async () => {
  isLoading.value = true
  try {
    await loadUserJournal()
    if (!currentJournal.value && sortedJournals.value.length > 0) {
      currentJournal.value = sortedJournals.value[0]
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.ipad-shell {
  position: relative;
  width: min(100%, 1100px);
  margin-left: auto;
  margin-right: auto;
  height: 900px;
  min-height: 900px;
  overflow: hidden;
  padding: 16px;
  border-radius: 40px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: linear-gradient(145deg, #1e293b 0%, #111827 100%);
  box-shadow: 0 22px 40px rgba(2, 6, 23, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.ipad-shell-fullscreen {
  width: 100%;
  height: calc(100vh - 3rem);
  min-height: calc(100vh - 3rem);
}

.ipad-camera {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translateX(-50%);
  border-radius: 9999px;
  background: radial-gradient(circle at 30% 30%, #64748b, #0f172a 70%);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.75);
}

.ipad-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(180deg, #f8f5ed 0%, #efe8d9 100%);
  padding: 20px;
}

.journal-tabs {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.6) transparent;
}

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

.ipad-home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  width: 112px;
  height: 4px;
  transform: translateX(-50%);
  border-radius: 9999px;
  background: rgba(203, 213, 225, 0.8);
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
  .ipad-shell {
    width: 100%;
    height: min(86vh, 760px);
    min-height: 620px;
    padding: 10px;
    border-radius: 28px;
  }

  .ipad-shell-fullscreen {
    height: calc(100vh - 1rem);
    min-height: calc(100vh - 1rem);
  }

  .ipad-screen {
    border-radius: 22px;
    padding: 14px;
  }

  .traces-scroll {
    border-radius: 12px;
  }

  .paper-content {
    padding-left: 42px;
    background-position: 30px 0, 0 0;
  }
}
</style>
