<template>
  <div>
    <div>{{ categoryTitle }}</div>
    <hr class="border-top border-slate-800 border-dashed my-1" />
    <div class="flex overflow-scroll">
      <div v-for="(problem, i) in problemsList" :key="i"><ProblemCard :problem="problem" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProblemCard from '@/components/ProblemCard.vue'

const props = defineProps<{
  problemsList: any[]
  categoryTitle: string
}>()
</script>
