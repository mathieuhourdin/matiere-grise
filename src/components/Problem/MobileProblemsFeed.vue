<template>
  <div>
    <ProblemCard v-for="(problem, i) in problemsList" class="border-b-1 h-screen border-black" :problem="problem" />
  </div>
</template>

<script setup lang="ts">
import ProblemCard from '@/components/Problem/ProblemCard.vue'

const props = defineProps<{
  problemsList: Problem[]
}>()
</script>
