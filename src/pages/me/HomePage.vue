<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <h1 class="text-2xl font-bold mb-4">Mon studio</h1>
    <div class="flex flex-col gap-4">
      <!-- Row 1: Achievements, Focus, Horizons -->
      <AnalysisSection />
      <!-- Row 2: Mentor image/message -->
      <MentorSection />
      <!-- Row 3: Journaling, Log Lecture, Log Production -->
      <JournalSection />
      <ActionButton @click="triggerAnalysisAction" type="valid" class="m-2 mb-6 w-24 ml-auto">Valider</ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnalysisSection from '@/components/Journal/AnalysisSection.vue'
import JournalSection from '@/components/Journal/JournalSection.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { useUser } from '@/composables/useUser'

const { triggerAnalysis } = useUser()

const triggerAnalysisAction = async () => {
  console.log('Trigger analysis action')
  await triggerAnalysis()
}
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