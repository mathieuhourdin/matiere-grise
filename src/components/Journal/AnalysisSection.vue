<template>
  <div class="flex gap-2 md:gap-8 overflow-x-auto pb-2">
    <!-- Analysis -->
    <HomeCard width="30%" height="36" :items="analysis.analysis" @itemClick="openAnalysisPage">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">👑</span>
          Analysis
        </h2>
      </template>
    </HomeCard>
    <!-- Resources (from displayLandmarks) -->
    <HomeCard width="30%" height="36" :items="landmarkResources" @itemClick="openLandmarkPage">
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          <span class="mr-2">🌍</span>
          Resources
        </h2>
      </template>
    </HomeCard>
    <!-- Tasks (from displayLandmarks) -->
    <HomeCard width="30%" height="36" :items="landmarkTasks">
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
import { type ApiResource, type ApiInteraction } from '@/types/models'
import { ref, onMounted, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'
import { useLens, type Landmark } from '@/composables/useLens'
import { useRouter } from 'vue-router'
const { user, deleteAnalysis, getUserLandmarks } = useUser()
const { getInteractions } = useInteraction()
const { displayLandmarks, loadUserLenses } = useLens()
const router = useRouter()
interface AnalysisItem {
  id: string
  title: string
  content: string
  date: Date | string
}

const analysis = ref({
  analysis: [] as AnalysisItem[],
  tasks: [] as AnalysisItem[],
  questions: [] as AnalysisItem[],
  resources: [] as AnalysisItem[],
  deliverables: [] as AnalysisItem[],
  processes: [] as AnalysisItem[],
})

const landmarks = ref<ApiResource[]>([])

const loadAnalysis = async () => {
  if (!user.value?.id) return
  
  try {
    // Use old method for analysis
    const analysisData = await getInteractions({ interaction_type: 'outp', interaction_user_id: user.value.id, resource_type: 'anly' })
    
    // Use landmarks for other sections
    const landmarks = await getUserLandmarks(user.value.id)
    console.log('landmarks : ', landmarks)

    landmarks.value = landmarks
    
    // Filter and format resources by type
    analysis.value = {
      analysis: formatAnalysis(analysisData),
      tasks: formatResources(landmarks.filter((r: ApiResource) => r.landmark_type === 'task')),
      questions: formatResources(landmarks.filter((r: ApiResource) => r.landmark_type === 'qest')),
      resources: formatResources(landmarks.filter((r: ApiResource) => r.landmark_type === 'rsrc')),
      deliverables: formatResources(landmarks.filter((r: ApiResource) => r.landmark_type === 'dlvr')),
      processes: formatResources(landmarks.filter((r: ApiResource) => r.landmark_type === 'proc')),
    }
  } catch (error) {
    console.error('Error loading analysis:', error)
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

const formatResources = (resources: ApiResource[]): AnalysisItem[] => {
  return resources.map((resource) => {
    return {
      title: resource.title,
      content: resource.id + ' - ' + resource.subtitle + ' - ' + resource.content,
      date: resource.created_at || new Date(),
      id: resource.id,
      resource_type: resource.resource_type,
    }
  })
}

const formatLandmarks = (landmarks: Landmark[]): AnalysisItem[] => {
  return landmarks.map((landmark) => {
    return {
      title: landmark.title || '',
      content: landmark.id + ' - ' + (landmark.content || ''),
      date: landmark.created_at || new Date(),
      id: landmark.id,
    }
  })
}

// Computed properties for landmarks from useLens
const landmarkTasks = computed(() => {
  return formatLandmarks(displayLandmarks.value.filter(l => l.landmark_type === 'task'))
})

const landmarkResources = computed(() => {
  return formatLandmarks(displayLandmarks.value.filter(l => l.landmark_type === 'rsrc'))
})

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

const openAnalysisPage = (item: AnalysisItem | { id?: string | number; title: string; content?: string; date?: Date | string }) => {
  if (item.id) {
    router.push('/me/analysis/' + item.id)
  }
}

const openLandmarkPage = (item: AnalysisItem | { id?: string | number; title: string; content?: string; date?: Date | string }) => {
  if (item.id) {
    router.push('/app/landmarks/' + item.id)
  }
}

onMounted(async () => {
  await loadAnalysis()
  
  // Load lenses (auto-selects the most recently updated lens)
  await loadUserLenses()
})
</script>

