<template>
  <div>
    <div class="fixed left-1/2 bottom-3 p-4 bg-green-400 rounded z-100">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  type: string
}>()
</script>
