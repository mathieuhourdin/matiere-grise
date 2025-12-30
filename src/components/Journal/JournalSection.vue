<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <JournalCard
      v-for="journal in userJournals"
      :key="journal.id"
      :journal="journal"
    />
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
import HomeCard from '@/components/Ui/HomeCard.vue'
import AddIcon from '@/components/Ui/Icons/AddIcon.vue'
import CreateJournalModal from '@/components/Resource/CreateJournalModal.vue'
import { useQuickCreateModal } from '@/composables/useQuickCreateModal'
import { useMe } from '@/composables/useMe'
import JournalCard from '@/components/Journal/JournalCard.vue'

const { openModal } = useQuickCreateModal()
const { userJournals, loadUserJournal } = useMe()

const isCreateJournalModalOpen = ref(false)



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

onMounted(async () => {
  await loadUserJournal()
})
</script>

