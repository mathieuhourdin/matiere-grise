<template>
  <div
    :class="[
      'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200',
      'bg-slate-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      'border border-slate-300 dark:border-gray-600',
      'hover:bg-slate-300 dark:hover:bg-gray-600'
    ]"
    :title="tooltip"
  >
    <span class="truncate max-w-[200px]">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  tooltip?: string
  maxLength?: number
}>(), {
  maxLength: 30,
  tooltip: ''
})

const displayText = computed(() => {
  if (props.text.length <= props.maxLength) {
    return props.text
  }
  return props.text.substring(0, props.maxLength) + '...'
})

const tooltip = computed(() => {
  return props.tooltip || props.text
})
</script>

