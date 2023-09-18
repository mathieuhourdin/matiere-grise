<template>
  <div class="w-fit">
    <ModalSheet :open="modalOpen" @close="modalOpen = false">
      <SeeThoughtInput :thought-input="thoughtInput" />
    </ModalSheet>
    <ThoughtInputCard class="md:w-96 w-full" :thought-input="thoughtInput" @click="modalOpen = true" />
  </div>
</template>

<script setup lang="ts">
import { type ThoughtInput } from '@/types/models'
import SeeThoughtInput from '@/components/SeeThoughtInput.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import ThoughtInputCard from '@/components/ThoughtInputCard.vue'
import { ref } from 'vue'

const props = defineProps<{
  thoughtInput: ThoughtInput
}>()

const modalOpen = ref(false)
</script>
