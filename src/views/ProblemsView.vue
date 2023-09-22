<template>
  <div>
    <div v-if="problems" class="m-4">
      <div class="underline italic" @click="createNewDraftProblemAndRedirect">
        Ajouter une problématique
      </div>
      <CategoryProblemsCarousel
        class="mt-4"
        v-for="category in displayedCategoriesWithProblems.sort(
          (a, b) => b.problems_count - a.problems_count
        )"
        :category="category"
        :key="category.id"
        :problems-list="category.problems"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CategoryProblemsCarousel from '@/components/CategoryProblemsCarousel.vue'
import { useProblem } from '@/composables/useProblem'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { type Problem, type Category } from '@/types/models'

const router = useRouter()
const { getProblems, newProblem, createProblem } = useProblem()
const problems = ref<Problem[] | null>(null)

const { categories } = useCategories()

const createNewDraftProblemAndRedirect = async () => {
  const problem = newProblem()
  const createdProblem = await createProblem(problem)
  router.push({ path: '/thought_outputs/' + createdProblem.id, query: { editing: "true" } })
}

type CategoryWithProblems = Category & { problems: Problem[], problems_count: number};
const displayedCategoriesWithProblems = computed(() => {
  const returnCategories = categories.value.map((category: Category) => {
    category.problems = getProblemsForCategory(category)
    category.problems_count = category.problems ? category.problems.length : 0
    return category as CategoryWithProblems
  })
  return returnCategories
})

const getProblemsForCategory = (category: Category) => {
  if (category.display_name == 'default')
    return problems.value?.filter((problem: Problem) => problem.category_id == null)
  return problems.value?.filter((problem: Problem) => problem.category_id == category.id)
}

onMounted(async () => (problems.value = await getProblems()))
</script>
