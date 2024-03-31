<template><div>
    <ProblemCard v-for="(problem, i) in problemsList" :problem="problem" />

  </div></template>

<script setup lang="ts">
import ProblemCard from '@/components/Problem/ProblemCard.vue'

const props = defineProps<{
  problemsList: Problem[]
}>()
</script>
