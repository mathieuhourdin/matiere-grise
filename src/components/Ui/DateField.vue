<template>
  <div>{{ displayDate }}</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  date: string
}>()
const displayDate = computed(() => {
  const jsDate = new Date(props.date)
  return jsDate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})
})
</script>
