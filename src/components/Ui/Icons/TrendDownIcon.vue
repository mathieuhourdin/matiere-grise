<template>
    <svg
  viewBox="0 0 24 24"
  class="h-4 w-4 text-red-400"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Axe / baseline (optionnel) -->
  <path
    d="M4 6H20"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-opacity="0.4"
  />
  <!-- Courbe / ligne de tendance qui descend -->
  <path
    d="M5 9L10 14L13 11L19 17"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Flèche en bas à droite -->
  <path
    d="M14.5 17H19V12.5"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    size?: string
}>()

const size = computed(() => {
    return props.size || '16'
})
</script>