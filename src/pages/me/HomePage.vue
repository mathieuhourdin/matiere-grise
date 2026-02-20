<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-6 md:w-11/12 mx-auto">
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
          :to="analysisLinkTo"
          class="text-sm underline text-slate-300 hover:text-slate-100 transition-colors"
        >
          Analyse &gt;
        </router-link>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Row 1: High-level journal analysis -->
      <section class="rounded-xl border border-slate-800" style="background-color: rgb(32, 32, 32);">
        <div class="flex flex-col xl:flex-row">
          <article class="flex-1 p-3 md:p-4 xl:min-h-[170px]">
            <div class="text-lg font-semibold text-slate-200 mb-2">
              Message de ton mentor {{ journalMentor.name }}
            </div>
            <div class="flex items-start gap-2 font-inter">
              <img
                :src="journalMentor.image"
                :alt="`Mentor ${journalMentor.name}`"
                class="w-9 h-9 rounded-lg object-cover flex-none"
              >
              <span class="text-xs leading-4 text-slate-300 whitespace-pre-line">
                {{ mentorMessage }}
              </span>
            </div>
            <div class="mt-4 flex justify-end">
              <router-link
                to="/app/mentor"
                class="text-xs underline text-slate-400 hover:text-slate-100 transition-colors"
              >
                Voir 4 autres messages
              </router-link>
            </div>
          </article>

          <article class="flex-1 border-t xl:border-t-0 xl:border-l border-slate-800 p-3 md:p-4 xl:min-h-[170px] font-inter">
            <div class="text-lg font-semibold text-slate-200 mb-2">
              Tes grands projets
            </div>
            <ul class="space-y-1.5 text-xs leading-4 text-slate-300">
              <li v-for="point in weeklySummaryLines" :key="point" class="whitespace-pre-line">• {{ point }}</li>
            </ul>
          </article>

        </div>
      </section>
      <!-- Row 1.5: Current Landscape Landmarks -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 px-3">
        <div class="col-span-1">
          <section class="mb-4 font-inter">
            <div class="mb-1 flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-slate-300">Métriques</h2>
            </div>
            <div class="mt-1 w-fit">
              <HeatmapSection compact :compact-weeks-limit="22" :frameless="true" :title="null" />
            </div>
            <div class="mt-2 flex justify-end">
              <router-link
                :to="metricsLinkTo"
                class="text-xs text-slate-400 underline hover:text-slate-200 transition-colors"
              >
                voir plus
              </router-link>
            </div>
          </section>
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-300">Activité récente</h2>
          </div>
          <LastElementsSection />
          <div class="mt-4 flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-300">Les plus utilisés</h2>
          </div>
          <MostFrequentLandmarksSection />
        </div>
        <div class="col-span-2">
          <JournalPadComponent class="mb-10" />
        </div>
      </div>
      
      <!-- Row 2: Achievements, Focus, Horizons -->
      <!--<AnalysisSection />-->
      <!-- Row 3: Mentor image/message -->
      <!--<MentorSection />-->
      <!-- Row 4: Journaling, Log Lecture, Log Production -->
      <!--<JournalSection />-->
    </div>
  </div>
</template>

<script setup lang="ts">
import AnalysisSection from '@/components/Journal/AnalysisSection.vue'
import JournalSection from '@/components/Journal/JournalSection.vue'
import LastElementsSection from '@/components/Lens/LastElementsSection.vue'
import MostFrequentLandmarksSection from '@/components/Lens/MostFrequentLandmarksSection.vue'
import HeatmapSection from '@/components/Heatmap/HeatmapSection.vue'
import JournalPadComponent from '@/components/Journal/JournalPadComponent.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { computed, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useLens } from '@/composables/useLens'

const { user } = useUser()
const { displayLandscapeAnalysis, displayLandmarks, loadUserLenses } = useLens()
const analysisLinkTo = computed(() => {
  const analysisId = displayLandscapeAnalysis.value?.id
  const query: Record<string, string> = { tab: 'compare' }
  if (analysisId) query.id = analysisId
  return {
    name: 'analysis',
    query
  }
})

const metricsLinkTo = computed(() => {
  const analysisId = displayLandscapeAnalysis.value?.id
  const query: Record<string, string> = { tab: 'timeline' }
  if (analysisId) query.id = analysisId
  return {
    name: 'analysis',
    query
  }
})

const journalMentor = {
  name: 'Gon',
  image: 'https://i.pinimg.com/originals/93/d7/e8/93d7e8cb60b17a0d12ac40e26f71064e.jpg'
}

const mentorMessage = computed(() => {
  const firstName = user.value?.first_name?.trim() || 'toi'
  return [
    `Bonjour ${firstName},`,
    "Bienvenue sur Matière Grise ! Je suis Gon, ton mentor. Je suis ici pour t'aider à progresser dans tes projets. L'important c'est de s'amuser et de relever des défis. Ensemble, on va soulever des montagnes !",
    'Hoooooosss !!!'
  ].join('\n')
})

const weeklySummaryLines = computed(() => {
  const highLevelProjects = displayLandmarks.value.filter((landmark: any) => {
    const landmarkType = String(landmark?.landmark_type ?? landmark?.landmarkType ?? '').trim().toUpperCase()
    return landmarkType === 'HIGH_LEVEL_PROJECT'
  })

  if (highLevelProjects.length === 0) {
    return ["Partant.e pour travailler sur tes grands projets ??"]
  }

  const lines = highLevelProjects
    .map((landmark: any) => {
      const title = String(landmark?.title ?? '').trim()
      const content = String(landmark?.content ?? '').trim()
      if (title && content && content !== title) return `${title}\n${content}`
      if (title) return title
      if (content) return content
      return ''
    })
    .filter((line: string) => line.length > 0)

  return lines.length > 0 ? lines : ["Partant.e pour travailler sur tes grands projets ??"]
})

watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) return
    await loadUserLenses()
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
