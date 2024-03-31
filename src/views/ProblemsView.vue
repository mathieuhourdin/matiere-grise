<template>
  <div>
    <div v-if="problems" class="md:m-4">
      <div v-if="isMobile">
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
      <div v-else>
        <MobileProblemsFeed
          v-for="category in displayedCategoriesWithProblems.sort(
            (a, b) => b.problems_count - a.problems_count
          )"
          :problems-list="category.problems"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CategoryProblemsCarousel from '@/components/Problem/CategoryProblemsCarousel.vue'
import MobileProblemsFeed from '@/components/Problem/MobileProblemsFeed.vue'
import { useProblem } from '@/composables/useProblem'
import { useMenu } from '@/composables/useMenu'
import { computed, onMounted, ref } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { type Resource, type Category } from '@/types/models'

const { getProblems } = useProblem()
const problems = ref<Resource[] | null>(null)

const { categories } = useCategories()

const { isMobile } = useMenu()

type CategoryWithProblems = Category & { problems: Resource[]; problems_count: number }
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
    return problems.value?.filter((problem: Resource) => problem.category_id == null)
  return problems.value?.filter((problem: Resource) => problem.category_id == category.id)
}

onMounted(async () => (problems.value = await getProblems()))
</script>
