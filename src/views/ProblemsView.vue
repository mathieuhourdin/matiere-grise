<template>
  <div>
    <div v-if="problems" class="m-4">
      <div class="underline italic" @click="createNewDraftProblemAndRedirect">
        Ajouter une problématique
      </div>
      <CategoryProblemsCarousel
        class="mt-4"
        v-for="category in displayedCategoriesWithProblems"
        :category="category"
        :key="category.id"
        :problems-list="category.problems"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CategoryProblemsCarousel from '@/components/CategoryProblemsCarousel.vue'
import { useProblem } from '@/composables/useProblem.ts'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useCategories } from '@/composables/useCategories.ts'

const router = useRouter()
const { getProblems, newProblem, createProblem } = useProblem()
const problems = ref(null)

const { categories } = useCategories()

const createNewDraftProblemAndRedirect = async () => {
  const problem = newProblem()
  const createdProblem = await createProblem(problem)
  router.push({ path: '/thought_outputs/' + createdProblem.id, query: { editing: true } })
}

const displayedCategoriesWithProblems = computed(() => {
  const returnCategories = categories.value.map((category) => {
    category.problems = getProblemsForCategory(category)
    return category
  })
  return returnCategories.sort((a, b) => a.problems.length < b.problems.length)
})

const getProblemsForCategory = (category) => {
  if (category.display_name == 'default')
    return problems.value.filter((problem) => problem.category_id == null)
  return problems.value.filter((problem) => problem.category_id == category.id)
}

onMounted(async () => (problems.value = await getProblems()))
</script>
