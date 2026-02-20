<template>
  <section :class="['ipad-shell', { 'ipad-shell-fullscreen': fullscreen }]">
    <div class="ipad-screen">
      <header class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Vos journaux</h2>
          <p class="text-xs text-slate-500">Consultez ce que vous avez ecrit et ajoutez de nouvelles traces</p>
        </div>
        <router-link
          :to="fullscreen ? '/me/home' : '/me/journal-pad'"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 bg-white/80 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors"
          :title='fullscreen ? "Fermer et revenir vers accueil" : "Ouvrir en plein écran"'
          :aria-label='fullscreen ? "Fermer et revenir vers accueil" : "Ouvrir le journal en plein écran"'
        >
          <ArrowsPointingInIcon v-if="fullscreen" class="w-4 h-4" />
          <ArrowTopRightOnSquareIcon v-else class="w-4 h-4" />
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
        <button
          type="button"
          :disabled="isCreatingJournal"
          @click="createNewJournal"
          :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all duration-200 shadow-sm',
            isCreatingJournal
              ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-wait'
              : 'border-slate-300 border-dashed bg-white/80 text-slate-600 hover:border-slate-400'
          ]"
        >
          <PlusIcon class="w-3.5 h-3.5" />
          <span>{{ isCreatingJournal ? 'Création...' : 'Nouveau journal' }}</span>
        </button>
      </div>

      <div class="mt-4 flex-1 min-h-0">
        <div v-if="isLoading" class="text-sm text-slate-500">Chargement...</div>
        <div v-else-if="!currentJournal" class="text-sm text-slate-500">Aucun journal trouve</div>
        <div v-else class="journal-canvas h-full">
          <div class="traces-scroll flex-1 min-h-0 overflow-y-auto pr-2">
            <div class="paper-content space-y-6">
              <div>
                <textarea
                  v-model="newTraceContent"
                  rows="3"
                  :placeholder="entryPlaceholder"
                  :disabled="isSubmittingEntry || isLoadingJournalTraces"
                  class="w-full rounded-xl border border-amber-200 bg-white/75 text-slate-700 text-base p-4 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 font-georgia disabled:opacity-70"
                ></textarea>
                <div class="mt-2 flex justify-end">
                  <button
                    type="button"
                    :disabled="isSubmittingEntry || isLoadingJournalTraces || !newTraceContent.trim() || !currentJournalId"
                    class="px-2.5 py-1 text-xs rounded-md border border-slate-300 bg-white/85 text-slate-700 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    @click="submitEntry"
                  >
                    {{ isSubmittingEntry ? 'Envoi...' : 'Valider' }}
                  </button>
                </div>
              </div>

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
import { useResource } from '@/composables/useResource'
import { useInteraction } from '@/composables/useInteraction'
import { useUser } from '@/composables/useUser'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar'
import { type ApiInteraction, type ApiTrace, type Resource } from '@/types/models'
import { ArrowTopRightOnSquareIcon, ArrowsPointingInIcon, PlusIcon } from '@heroicons/vue/24/outline'

withDefaults(defineProps<{
  fullscreen?: boolean
}>(), {
  fullscreen: false
})

const { userJournals, loadUserJournal } = useJournal()
const { createResource, createTrace, updateResource } = useResource()
const { createInteractionForResource } = useInteraction()
const { user } = useUser()
const { launchSnackbar } = useSnackbar()

const isLoading = ref(false)
const isLoadingJournalTraces = ref(false)
const newTraceContent = ref('')
const journalTraces = ref<ApiTrace[]>([])
const isCreatingJournal = ref(false)
const isSubmittingEntry = ref(false)
const titleInitializedByJournalId = ref<Record<string, boolean>>({})
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

const isTitleEntryMode = computed(() => {
  const journalId = currentJournalId.value
  if (!journalId) return false
  if (titleInitializedByJournalId.value[journalId]) return false
  if (journalTraces.value.length > 0) return false
  const currentTitle = (currentJournal.value?.resource?.title ?? '').trim()
  return currentTitle.length === 0 || currentTitle === 'Nouveau journal'
})

const entryPlaceholder = computed(() => {
  return isTitleEntryMode.value ? 'Titre du journal' : 'Ecrire une nouvelle trace...'
})

const selectJournal = (journal: ApiInteraction) => {
  currentJournal.value = journal
}

const createNewJournal = async () => {
  if (isCreatingJournal.value) return
  if (!user.value?.id) {
    launchSnackbar('Utilisateur non trouvé', 'error')
    return
  }

  isCreatingJournal.value = true
  try {
    const resource: Resource = {
      title: 'Nouveau journal',
      subtitle: '',
      content: '',
      external_content_url: '',
      comment: '',
      image_url: '',
      maturing_state: 'drft',
      publishing_state: '',
      resource_type: 'jrnl',
      is_local_draft: false
    }

    const createdResource = await createResource(resource)
    await createInteractionForResource(createdResource.id, {
      interaction_progress: 0,
      interaction_date: new Date(),
      interaction_comment: '',
      interaction_is_public: false
    })

    await loadUserJournal()
    const createdJournal = userJournals.value.find((journal) => {
      return (journal.resource_id ?? journal.resource?.id) === createdResource.id
    })
    if (createdJournal) currentJournal.value = createdJournal
    titleInitializedByJournalId.value[createdResource.id] = false
    launchSnackbar('Nouveau journal créé', 'success')
  } catch (error) {
    console.error('Error creating new journal:', error)
    launchSnackbar('Erreur lors de la création du journal', 'error')
  } finally {
    isCreatingJournal.value = false
  }
}

const submitEntry = async () => {
  const content = newTraceContent.value.trim()
  const journalId = currentJournalId.value
  if (!content || !journalId) return

  isSubmittingEntry.value = true
  try {
    if (isTitleEntryMode.value) {
      const currentResource = currentJournal.value?.resource
      const payload: Resource = {
        title: content,
        subtitle: currentResource?.subtitle ?? '',
        content: currentResource?.content ?? '',
        external_content_url: currentResource?.external_content_url ?? '',
        comment: currentResource?.comment ?? '',
        image_url: currentResource?.image_url ?? '',
        maturing_state: currentResource?.maturing_state ?? 'drft',
        publishing_state: currentResource?.publishing_state ?? '',
        resource_type: 'jrnl',
        is_local_draft: false
      }
      await updateResource(journalId, payload)
      titleInitializedByJournalId.value[journalId] = true
      await loadUserJournal()
      const updatedJournal = userJournals.value.find((journal) => {
        return (journal.resource_id ?? journal.resource?.id) === journalId
      })
      if (updatedJournal) currentJournal.value = updatedJournal
      launchSnackbar('Titre du journal mis à jour', 'success')
    } else {
      await createTrace({ content, journal_id: journalId } as any)
      await loadTracesForJournal(journalId)
      launchSnackbar('Trace ajoutée', 'success')
    }
    newTraceContent.value = ''
  } catch (error) {
    console.error('Error submitting journal entry:', error)
    launchSnackbar("Erreur lors de l'envoi", 'error')
  } finally {
    isSubmittingEntry.value = false
  }
}

const loadTracesForJournal = async (journalId: string) => {
  const token = ++tracesRequestToken
  isLoadingJournalTraces.value = true
  try {
    const response = await fetchWrapper.get(`/journals/${journalId}/traces`)
    if (token !== tracesRequestToken) return
    const list = Array.isArray(response.data) ? response.data : []
    journalTraces.value = list
    if (list.length > 0) {
      titleInitializedByJournalId.value[journalId] = true
    }
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
    newTraceContent.value = ''
    return
  }
  journalTraces.value = []
  newTraceContent.value = ''
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
