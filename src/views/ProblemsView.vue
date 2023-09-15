<template>
  <div>
    <div class="m-4">
      <div class="underline italic" @click="createNewDraftProblemAndRedirect">Ajouter une problématique</div>
      <CategoryProblemsCarousel category-title="Histoire et sociétés" :problems-list="problems" />
    </div>
  </div>
</template>
<script setup lang="ts">
import CategoryProblemsCarousel from '@/components/CategoryProblemsCarousel.vue'
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
