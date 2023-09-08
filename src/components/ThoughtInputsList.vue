<template>
  <div>
    <div v-for="thoughtInput in thoughtInputs" :key="thoughtInput.id">{{ thoughtInput.resource_title }}</div>
  </div>
</template>

<script setup lang="ts">
import { ThoughtInput } from '@/composables/useThoughtInputs.ts'
const props = defineProps<{
  thoughtInputs: [ThoughtInput]
}>()
</script>
