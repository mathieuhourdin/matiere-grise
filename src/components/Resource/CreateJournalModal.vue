<template>
  <ModalSheet :open="isOpen" @close="handleClose" max-width="max-w-4xl" max-height="h-[90%]">
    <CreateJournalContent
      :show-cancel="true"
      @close="handleClose"
      @created="handleCreated"
    />
  </ModalSheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateJournalContent from '@/components/Resource/CreateJournalContent.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', resourceId: string): void
}>()

const isOpen = ref(false)

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

const handleClose = () => {
  isOpen.value = false
  emit('close')
}

const handleCreated = (resourceId: string) => {
  emit('created', resourceId)
  handleClose()
}
</script>

