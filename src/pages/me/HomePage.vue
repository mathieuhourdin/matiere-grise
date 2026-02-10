<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mon studio</h1>
      <router-link
        to="/app/llm-calls"
        class="text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        LLM Calls
      </router-link>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Row 1: Traces + Lenses + Heatmap -->
      <TracesSection />
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
import TracesSection from '@/components/Trace/TracesSection.vue'
import OpenJournalSection from '@/components/Journal/OpenJournalSection.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'

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
