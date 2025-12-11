<template>
  <div class="w-fit">
    <ModalSheet :open="modalOpen" @close="modalOpen = false">
      <SeeThoughtInput :thought-input="thoughtInput" :usage-reason="usageReason" />
    </ModalSheet>
    <ThoughtInputCard
      class="md:w-96"
      :contextual-resource="thoughtInput"
      :is-disabled="isDisabled"
      :open="open"
    />
  </div>
</template>

<script setup lang="ts">
import { type ContextualResource } from '@/types/models'
import SeeThoughtInput from '@/components/ThoughtInput/SeeThoughtInput.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import ThoughtInputCard from '@/components/ThoughtInput/ThoughtInputCard.vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    thoughtInput: ContextualResource
    usageReason?: string
    isDisabled: boolean
    open: boolean
  }>(),
  { isDisabled: false }
)

const modalOpen = ref(false)
</script>
