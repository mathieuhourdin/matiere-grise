<template>
  <div>
    <div class="m-4">
      <div class="underline italic" @click="createNewDraftProblemAndRedirect">Ajouter une problématique</div>
      <div>Histoire et sociétés</div>
      <hr class="border-top border-slate-800 border-dashed my-1" />
      <div class="flex flex-wrap">
        <div v-for="(problem, i) in problems" :key="i"><ProblemCard :problem="problem" /></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ProblemCard from '@/components/ProblemCard.vue'
import { useProblem } from '@/composables/useProblem.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const { getProblems, newProblem, createProblem } = useProblem()
const problems = ref([])


const createNewDraftProblemAndRedirect = async () => {
  const problem = newProblem();
  const createdProblem = await createProblem(problem);
  router.push({ path: '/thought_outputs/' + createdProblem.id, query: { editing: true }})
}
onMounted(async () => problems.value = await getProblems())
</script>
