<template>
  <div>
    <div class="flex">
      <div>{{ getCategoryName(category.display_name) }}</div>
      <div @click="createNewDraftProblemAndRedirect" class="ml-auto text-sm mr-2 underline">
        Ajouter
      </div>
    </div>
    <hr class="border-top border-slate-800 border-dashed my-1" />
    <div class="flex overflow-scroll">
      <div class="mb-4" v-for="(problem, i) in problemsList" :key="i">
        <ProblemCard :problem="problem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Category, type Problem } from '@/types/models'
import { useProblem } from '@/composables/useProblem'
import { useRouter } from 'vue-router'
const { newProblem, createProblem } = useProblem()
import ProblemCard from '@/components/Problem/ProblemCard.vue'

const props = defineProps<{
  problemsList: Problem[]
  category: Category
}>()

const router = useRouter()
const createNewDraftProblemAndRedirect = async () => {
  const problem = newProblem()
  problem.resource.category_id = props.category.id
  const createdProblem = await createProblem(problem)
  router.push({
    path: '/thought_outputs/' + createdProblem.resource.id,
    query: { editing: 'true' }
  })
}

const getCategoryName = (categoryName: string) => {
  return categoryName == 'default' ? 'Autres' : categoryName
}
</script>
