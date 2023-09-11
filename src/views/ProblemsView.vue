<template>
  <div>
    <div class="m-4">
      <div>Histoire et sociétés</div>
      <hr class="border-top border-slate-800 border-dashed my-1" />
      <div class="flex">
        <div v-for="(problem, i) in problems" :key="i"><ProblemCard :problem="problem" /></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ProblemCard from '@/components/ProblemCard.vue'
import { useProblem } from '@/composables/useProblem.ts'
import { ref } from 'vue'
const { getProblems } = useProblem()
const problems = ref(getProblems())
</script>
