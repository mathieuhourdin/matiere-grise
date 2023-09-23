<template>
  <div class="w-fit">
    <ModalSheet :open="modalOpen" @close="modalOpen = false">
      <SeeThoughtInput :thought-input="thoughtInput" :usage-reason="usageReason" />
    </ModalSheet>
    <ThoughtInputCard class="md:w-96" :thought-input="thoughtInput" :usage-reason="usageReason" @click="modalOpen = true" />
  </div>
</template>

<script setup lang="ts">
import { type ApiThoughtInput } from '@/types/models'
import SeeThoughtInput from '@/components/SeeThoughtInput.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import ThoughtInputCard from '@/components/ThoughtInputCard.vue'
import { ref } from 'vue'

const props = defineProps<{
  thoughtInput: ApiThoughtInput,
  usageReason?: string
}>()

const modalOpen = ref(false)
</script>
