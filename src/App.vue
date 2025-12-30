<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import UiSnackbar from '@/components/Ui/UiSnackbar.vue'
import QuickCreateResourceModal from '@/components/QuickCreateResourceModal.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useQuickCreateModal } from '@/composables/useQuickCreateModal'
import ActionButton from '@/components/Ui/ActionButton.vue'
import AddIcon from '@/components/Ui/Icons/AddIcon.vue'
import BottomNavbar from '@/components/App/BottomNavbar.vue'
const { snackbar } = useSnackbar()
const { isOpen, openModal, closeModal, handleResourceCreated } = useQuickCreateModal()
</script>

<template>
  <div class="flex flex-col h-screen bg-white dark:bg-custom transition-colors duration-200">
    <AppHeader class="overflow-auto" />
    <RouterView class="pb-16 md:pb-0" />
  </div>
  <BottomNavbar />
  <UiSnackbar v-if="snackbar" :message="snackbar.message" :type="snackbar.type" />
  <ActionButton type="valid" size="sm" @click="openModal" class="p-0 absolute bottom-28 md:bottom-20 w-12 h-12 right-4 z-[90]"> <AddIcon /> </ActionButton>
  <QuickCreateResourceModal 
    :open="isOpen" 
    @close="closeModal"
    @created="handleResourceCreated"
  />

</template>

<style>

.dark-bg {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at top left,  #2f4f7c 0, transparent 70%),
    radial-gradient(circle at bottom right, #242f4b 0, transparent 70%),
    #020617;  /* couleur de base */
  color: #e5e7eb;
}
</style>
