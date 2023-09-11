<template>
  <div class="border shadow-xl rounded m-2 p-4 h-72 w-60">
    <div class="max-h-full">
      <img class="h-28 mx-auto mb-4" :src="problem.image_url" />
      <div class="h-full">
        <div>{{ problem.title }}</div>
        <div class="text-2xs italic" style="margin-top: -8px">
          {{ problem.owner_id }}
        </div>
        <div class="text-2xs mb-auto">{{ formatText(problem.description) }}</div>
        <div class="flex mt-auto">
          <div class="text-2xs italic mt-auto">{{ formatDate(problem.created_at) }}</div>
          <div class="ml-auto text-2xs underline">{{ problem.inputs }} inputs</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Problem } from '@/composables/useProblem.ts'
const props = defineProps<{
  problem: Problem
}>()

const formatDate = (date: Date) => {
  return date.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}
const formatText = (text) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}
</script>
