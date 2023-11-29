<template>
  <div class="w-fit">
    <ModalSheet :open="modalOpen" @close="modalOpen = false">
      <SeeThoughtInput :thought-input="thoughtInput" :usage-reason="usageReason" />
    </ModalSheet>
    <ThoughtInputCard
      class="md:w-96"
      :contextual-resource="thoughtInput"
    />
  </div>
</template>

<script setup lang="ts">
import { type ContextualResource } from '@/types/models'
import SeeThoughtInput from '@/components/SeeThoughtInput.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import ThoughtInputCard from '@/components/ThoughtInputCard.vue'
import { ref } from 'vue'

const props = defineProps<{
  thoughtInput: ContextualResource
  usageReason?: string
}>()

const modalOpen = ref(false)
</script>
