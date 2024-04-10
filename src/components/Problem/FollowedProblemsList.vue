<template>
  <div class="flex">
    <FollowedProblem v-for="problem in problems" :problem="problem" class="shrink-0 grow-0 w-16" />
  </div>
</template>

<script setup lang="ts">
import FollowedProblem from '@/components/Problem/FollowedProblem.vue'
import { useProblem } from '@/composables/useProblem'
import { ref, onMounted } from 'vue'

const { getProblems } = useProblem()

const problems = ref<Problem[]>([])

onMounted(async () => {
  problems.value = await getProblems()
})
</script>
