<template>
  <div class="flex gap-2 md:gap-8 overflow-x-auto pb-2">
    <!-- Analysis -->
    <HomeCard width="30%" height="36" :items="analysis.analysis" @itemClick="deleteAnalysisItem">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">👑</span>
          Analysis
        </h2>
      </template>
    </HomeCard>
    <!-- Tasks -->
    <HomeCard width="30%" height="36" :items="analysis.tasks">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">👑</span>
          Tasks
        </h2>
      </template>
    </HomeCard>
    <!-- Questions -->
    <HomeCard width="30%" height="36" :items="analysis.questions">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">🧑‍💻</span>
          Questions
        </h2>
      </template>
    </HomeCard>
    <!-- Resources -->
    <HomeCard width="30%" height="36" :items="analysis.resources">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">🌍</span>
          Resources
        </h2>
      </template>
    </HomeCard>
    <!-- Deliverables -->
    <HomeCard width="30%" height="36" :items="analysis.deliverables">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">👑</span>
          Deliverables
        </h2>
      </template>
    </HomeCard>
    <!-- Processes -->
    <HomeCard width="30%" height="36" :items="analysis.processes">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">🧑‍💻</span>
          Processes
        </h2>
      </template>
    </HomeCard>
  </div>
</template>

<script setup lang="ts">
import HomeCard from '@/components/Ui/HomeCard.vue'
import { useInteraction } from '@/composables/useInteraction'
import { type ApiInteraction } from '@/types/models'
import { ref, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
const { user, deleteAnalysis } = useUser()
const { getInteractions } = useInteraction()

interface AnalysisItem {
  id: string
  title: string
  content: string
  date: Date
}

const analysis = ref({
  analysis: [] as AnalysisItem[],
  tasks: [] as AnalysisItem[],
  questions: [] as AnalysisItem[],
  resources: [] as AnalysisItem[],
  deliverables: [] as AnalysisItem[],
  processes: [] as AnalysisItem[],
})

const loadAnalysis = async () => {
  if (!user.value) return
  const analysisData = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'anly' })
  const tasks = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'task' })
  const questions = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'qest' })
  const resources = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'rsrc' })
  const deliverables = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'dlvr' })
  const processes = await getInteractions({ interaction_type: 'anly', interaction_user_id: user.value?.id, resource_type: 'proc' })
  analysis.value = {
    analysis: formatAnalysis(analysisData),
    tasks: formatAnalysis(tasks),
    questions: formatAnalysis(questions),
    resources: formatAnalysis(resources),
    deliverables: formatAnalysis(deliverables),
    processes: formatAnalysis(processes),
  }
}

const formatAnalysis = (analysis: ApiInteraction[]): AnalysisItem[] => {
  return analysis.map((interaction) => {
    return {
      title: interaction.resource.title,
      content: interaction.resource.id + ' - ' + interaction.resource.subtitle + ' - ' + interaction.resource.content,
      date: interaction.interaction_date,
      id: interaction.resource.id,
    }
  })
}

const deleteAnalysisItem = async (item: AnalysisItem) => {
  try {
    await deleteAnalysis(item.id)
    console.log('Delete analysis item : ', item)
    // Reload analysis after successful deletion
    await loadAnalysis()
  } catch (error) {
    console.error('Failed to delete analysis item:', error)
  }
}

onMounted(async () => {
  await loadAnalysis()
})
</script>

