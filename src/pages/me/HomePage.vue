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
    <div class="mb-6 flex items-end gap-4">
      <TextInput
        label="Date d'analyse"
        v-model="analysisDate"
        type="date"
        class="flex-1 max-w-xs"
      />
      <ActionButton @click="triggerAnalysisAction" type="valid" class="mb-0">Valider</ActionButton>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Row 1: Lens Selection & Analysis -->
      <LensSection />
      <!-- Row 1.5: Traces -->
      <TracesSection />
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
import LensSection from '@/components/Lens/LensSection.vue'
import TracesSection from '@/components/Trace/TracesSection.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'

const { triggerAnalysis } = useUser()
const { launchSnackbar } = useSnackbar()

// Set default date to today in YYYY-MM-DD format
const today = new Date()
const defaultDate = today.toISOString().split('T')[0]
const analysisDate = ref<string>(defaultDate)

const triggerAnalysisAction = async () => {
  if (!analysisDate.value) {
    launchSnackbar('Please select a date', 'error')
    return
  }
  console.log('Trigger analysis action with date:', analysisDate.value)
  await triggerAnalysis(analysisDate.value)
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