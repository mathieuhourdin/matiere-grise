<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mon studio</h1>
      <div class="flex items-center gap-3">
        <div class="inline-flex rounded-lg border border-slate-700 bg-slate-900/60 p-0.5">
          <button
            type="button"
            class="px-2.5 py-1 text-xs rounded-md transition-colors"
            :class="!workshopMode ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'"
            @click="workshopMode = false"
          >
            Journal
          </button>
          <button
            type="button"
            class="px-2.5 py-1 text-xs rounded-md transition-colors"
            :class="workshopMode ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'"
            @click="workshopMode = true"
          >
            Atelier
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Row 1: High-level journal analysis -->
      <section v-if="!workshopMode" class="rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="flex flex-col xl:flex-row">
          <article class="flex-1 p-3 md:p-4 xl:min-h-[170px]">
            <div class="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
              Message du mentor
            </div>
            <div class="flex items-start gap-2">
              <img
                :src="journalMentor.image"
                :alt="`Mentor ${journalMentor.name}`"
                class="w-9 h-9 rounded-lg object-cover flex-none"
              >
              <div class="min-w-0">
                <div class="text-xs font-semibold text-slate-200 mb-1">{{ journalMentor.name }}</div>
                <p class="text-[11px] leading-4 text-slate-300 line-clamp-6">
                  {{ journalMentor.message }}
                </p>
              </div>
            </div>
          </article>

          <article class="flex-1 border-t xl:border-t-0 xl:border-l border-slate-800 p-3 md:p-4 xl:min-h-[170px]">
            <div class="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
              Synthèse de la semaine
            </div>
            <ul class="space-y-1.5 text-[11px] leading-4 text-slate-300">
              <li v-for="point in weeklySummary" :key="point">• {{ point }}</li>
            </ul>
          </article>

          <article class="flex-1 border-t xl:border-t-0 xl:border-l border-slate-800 p-3 md:p-4 xl:min-h-[170px]">
            <HeatmapDisplay
              compact
              title="Activité"
              :days="journalHeatmap"
              :loading="journalHeatmapLoading"
              month-locale="fr-FR"
              :compact-weeks-limit="20"
              :hide-first-compact-month-label="true"
              empty-text="Aucune donnée"
            />
          </article>
        </div>
      </section>
      <!-- Row 1 (workshop): Traces -->
      <TracesSection v-else />
      <!-- Row 1.5: Current Landscape Landmarks -->
      <CurrentLandscapeLandmarksSection />
      <!-- Row 1.6: Open Journal -->
      <OpenJournalSection class="mb-10" />
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
import TracesSection from '@/components/Trace/TracesSection.vue'
import OpenJournalSection from '@/components/Journal/OpenJournalSection.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useUser } from '@/composables/useUser'

const workshopMode = ref(false)
const { user } = useUser()

type HeatmapDay = {
  day: string
  value: number
}

const journalHeatmap = ref<HeatmapDay[]>([])
const journalHeatmapLoading = ref(false)

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
    await loadJournalHeatmap(userId)
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
