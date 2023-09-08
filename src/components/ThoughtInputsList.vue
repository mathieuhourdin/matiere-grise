<template>
  <div>
    <div class="absolute md:border h-full left-1/2" />
    <ThoughtInputCard
      v-for="(thoughtInput, index) in thoughtInputs"
      :key="thoughtInput.id"
      class="mx-auto md:mr-0 max-w-full"
      :class="{ 'md:ml-0': index % 2 == 0 }"
      :thought-input="thoughtInput"
    />
  </div>
</template>

<script setup lang="ts">
import ThoughtInputCard from '@/components/ThoughtInputCard.vue'
import { ThoughtInput } from '@/composables/useThoughtInputs.ts'
const props = defineProps<{
  thoughtInputs: [ThoughtInput]
}>()
</script>
