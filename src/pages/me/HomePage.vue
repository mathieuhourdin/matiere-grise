<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mon studio</h1>
      <div class="flex items-center gap-3">
        <router-link
          :to="{ name: 'journalPad' }"
          class="text-sm underline text-slate-300 hover:text-slate-100 transition-colors"
        >
          Continuer le journal
        </router-link>
        <router-link
          v-if="analysisLinkTo"
          :to="analysisLinkTo"
          class="text-sm underline text-slate-300 hover:text-slate-100 transition-colors"
        >
          Analyse &gt;
        </router-link>
        <span v-else class="text-sm text-slate-500">
          Analyse &gt;
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Row 1: High-level journal analysis -->
      <section class="rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="flex flex-col xl:flex-row">
          <article class="flex-1 p-3 md:p-4 xl:min-h-[170px]">
            <div class="text-sm uppercase tracking-wide text-slate-400 mb-2">
              Message du mentor
            </div>
            <div class="flex items-start gap-2">
              <img
                :src="journalMentor.image"
                :alt="`Mentor ${journalMentor.name}`"
                class="w-9 h-9 rounded-lg object-cover flex-none"
              >
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-200 mb-1">{{ journalMentor.name }}</div>
                <p class="text-sm leading-4 text-slate-300 line-clamp-6">
                  {{ journalMentor.message }}
                </p>
              </div>
            </div>
          </article>

          <article class="flex-1 border-t xl:border-t-0 xl:border-l border-slate-800 p-3 md:p-4 xl:min-h-[170px]">
            <div class="text-sm uppercase tracking-wide text-slate-400 mb-2">
              Synthèse de la semaine
            </div>
            <ul class="space-y-1.5 text-sm leading-4 text-slate-300">
              <li v-for="point in weeklySummary" :key="point">• {{ point }}</li>
            </ul>
          </article>

        </div>
      </section>
      <!-- Row 1.5: Current Landscape Landmarks -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div class="col-span-1">
        <CurrentLandscapeLandmarksSection />
        </div>
        <div class="col-span-2">
          <article class="flex-1 my-4 border-t xl:border-t-0 xl:border-l border-slate-800 p-3 md:p-4 xl:min-h-[170px]">
            <HeatmapDisplay
              compact
              title="Activité"
              :days="journalHeatmap"
              :loading="journalHeatmapLoading"
              month-locale="fr-FR"
              :compact-weeks-limit="40"
              :hide-first-compact-month-label="true"
              empty-text="Aucune donnée"
              show-legend
            />
          </article>
          <JournalPadComponent class="mb-10" />
        </div>
      </div>
      <!-- Row 2: Achievements, Focus, Horizons -->
      <AnalysisSection />
      <!-- Row 3: Mentor image/message -->
      <MentorSection />
      <!-- Row 4: Journaling, Log Lecture, Log Production -->
      <JournalSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import AnalysisSection from '@/components/Journal/AnalysisSection.vue'
import JournalSection from '@/components/Journal/JournalSection.vue'
import CurrentLandscapeLandmarksSection from '@/components/Lens/CurrentLandscapeLandmarksSection.vue'
import HeatmapDisplay from '@/components/Heatmap/HeatmapDisplay.vue'
import JournalPadComponent from '@/components/Journal/JournalPadComponent.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { computed, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useUser } from '@/composables/useUser'
import { useLens } from '@/composables/useLens'

const { user } = useUser()
const { displayLandscapeAnalysis, loadUserLenses } = useLens()

type HeatmapDay = {
  day: string
  value: number
}

const journalHeatmap = ref<HeatmapDay[]>([])
const journalHeatmapLoading = ref(false)
const analysisLinkTo = computed(() => {
  const analysisId = displayLandscapeAnalysis.value?.id
  if (!analysisId) return null
  return {
    name: 'analysis',
    params: { id: analysisId },
    query: { view: 'compare' }
  }
})

const journalMentor = {
  name: 'Gon',
  image: 'https://i.pinimg.com/originals/93/d7/e8/93d7e8cb60b17a0d12ac40e26f71064e.jpg',
  message: "Franchement, vu d'ici, on dirait que tu es en plein arc d'entraînement avant un énorme examen de Hunter. Tu ne fais plus juste des petites quêtes séparées : tu t'es trouvé un vrai boss final, les survivances souterraines de la cité industrielle, et tu tapes dessus tous les jours sous plusieurs angles."
}

const weeklySummary = [
  "Tu as consolidé tes notes de lecture et transformé plusieurs intuitions en hypothèses formulées.",
  'La progression est régulière sur les tâches critiques, avec une bonne cadence de production écrite.',
  "Point d'attention : réduire la dispersion en début de session pour garder plus d'énergie sur les priorités."
]

const loadJournalHeatmap = async (userId: string) => {
  journalHeatmapLoading.value = true
  try {
    const response = await fetchWrapper.get(`/users/${userId}/heatmaps`)
    journalHeatmap.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching journal heatmap:', error)
    journalHeatmap.value = []
  } finally {
    journalHeatmapLoading.value = false
  }
}

watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) {
      journalHeatmap.value = []
      journalHeatmapLoading.value = false
      return
    }
    await Promise.all([
      loadJournalHeatmap(userId),
      loadUserLenses()
    ])
  },
  { immediate: true }
)
</script>

<style scoped>
/* Hide scrollbars while maintaining scroll functionality */
.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar,
.overflow-auto::-webkit-scrollbar,
.overflow-scroll::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto,
.overflow-y-auto,
.overflow-auto,
.overflow-scroll {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
