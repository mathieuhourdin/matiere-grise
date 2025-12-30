<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <JournalCard
      v-for="journal in userJournals"
      :key="journal.id"
      :journal="journal"
    />
    <HomeCard 
      width="30%" 
      height="40" 
      class="min-w-[280px]" 
      show-action 
      action-icon="AddIcon" 
      :items="journalings"
      :item-class="'leading-4'"
      @action="addJournaling"
    >
      <template #header>
        <h2 @click="openJournal" class="flex items-center text-xs md:text-base font-bold">
          Journaling
          <TrendUpIcon class="w-8 h-8 ml-2" />
        </h2>
      </template>
    </HomeCard>
    <!-- Log Lecture -->
    <HomeCard 
      width="30%" 
      height="40" 
      class="min-w-[280px]" 
      show-action 
      action-icon="AddIcon" 
      :items="logLectures"
      :show-date="true"
      @action="addLogLecture"
    >
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          Log Lecture
          <TrendDownIcon class="w-8 h-8 ml-2" />
        </h2>
      </template>
    </HomeCard>
    <!-- Log Production -->
    <HomeCard 
      width="30%" 
      height="40" 
      show-action 
      action-icon="AddIcon" 
      :items="logProductions"
      :show-date="true"
      :content-class="'overflow-scroll h-full'"
      :list-class="'list-disc list-inside h-full overflow-scroll'"
      @action="addLogProduction"
    >
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold">
          Log Production
          <TrendUpIcon class="w-8 h-8 ml-2" />
        </h2>
      </template>
    </HomeCard>
    <!-- Nouveau Journal -->
    <HomeCard
      width="30%"
      height="40"
      :content-class="'mt-4'"
      class="cursor-pointer hover:opacity-80 transition-opacity"
      @click="openCreateJournalModal"
    >
      <template #header>
        <h2 class="flex items-center text-xs md:text-base font-bold text-slate-300 dark:text-gray-400">
          Nouveau Journal
        </h2>
      </template>
      <AddIcon class="w-8 h-8 ml-2 mx-auto my-auto text-slate-300 dark:text-gray-400" />
    </HomeCard>
  </div>
  <!-- Create Journal Modal -->
  <CreateJournalModal :open="isCreateJournalModalOpen" @close="closeCreateJournalModal" @created="handleJournalCreated" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeCard from '@/components/Ui/HomeCard.vue'
import AddIcon from '@/components/Ui/Icons/AddIcon.vue'
import TrendUpIcon from '@/components/Ui/Icons/TrendUpIcon.vue'
import TrendDownIcon from '@/components/Ui/Icons/TrendDownIcon.vue'
import CreateJournalModal from '@/components/Resource/CreateJournalModal.vue'
import { useQuickCreateModal } from '@/composables/useQuickCreateModal'
import { useMe } from '@/composables/useMe'
import JournalCard from '@/components/Journal/JournalCard.vue'

const router = useRouter()
const { openModal } = useQuickCreateModal()
const { userJournals, loadUserJournal } = useMe()

const isCreateJournalModalOpen = ref(false)

const journalings = ref([
  {
    title: "Journal vendredi 12 décembre 2025",
    content: "Journaling de la journée",
    date: new Date("2025-12-12")
  },
  {
    title: "Journal jeudi 11 décembre 2025",
    content: "Log Lecture de la journée",
    date: new Date("2025-12-11")
  },
  {
    title: "Journal mercredi 10 décembre 2025",
    content: "Log Production de la journée",
    date: new Date("2025-12-10")
  },
])

const logLectures = ref([
  {
    title: "DDIA Chapter 4",
    content: "Fin des encodings",
    date: new Date("2025-12-12")
  },
  {
    title: "DDIA Chapter 4",
    content: "Debute des encodings",
    date: new Date("2025-12-11")
  },
  {
    title: "HOM Chapter 1",
    content: "1:1 meetings by Andy Grove",
    date: new Date("2025-12-11")
  },
])

const logProductions = ref([
  {
    title: "Idée sur la cité industrielle souterraine",
    content: "La cité industrielle continue à exister dans certains espaces",
    date: new Date("2025-12-12")
  },
  {
    title: "Rythme pour garder la structure",
    content: "Le rythme permet de ne pas laisser les actins s'étaller trop longtemps",
    date: new Date("2025-12-11")
  },
])

const openJournal = () => {
  router.push('/me/resources/' + userJournals.value[0].resource_id + '/feed')
}

const openCreateJournalModal = () => {
  isCreateJournalModalOpen.value = true
}

const closeCreateJournalModal = () => {
  isCreateJournalModalOpen.value = false
}

const handleJournalCreated = (resourceId: string) => {
  // Optionally reload or navigate after journal creation
  // For now, the modal will handle navigation
}

const addLogProduction = () => {
  openModal('logProduction')
}

const addLogLecture = () => {
  openModal('logLecture')
}

const addJournaling = () => {
  openModal('journaling')
}

onMounted(async () => {
  await loadUserJournal()
})
</script>

