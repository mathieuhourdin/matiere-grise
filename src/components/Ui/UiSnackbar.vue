<template>
  <div>
    <div class="shadow-xl fixed left-1/2 -translate-x-1/2 bottom-3 p-4 bg-green-400 rounded-lg z-100" :class="cssClass">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
const props = defineProps<{
  message: string
  type: string
}>()

const cssClass = computed(() => {
  if (props.type === "success") {
    return { 'bg-green-400': true }
  } else if (props.type === "error") {
    return { 'bg-red-400': true }
  } else {
    return {}
  }
})
</script>
