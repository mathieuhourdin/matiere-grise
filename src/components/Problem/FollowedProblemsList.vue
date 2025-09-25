<template>
  <div class="flex">
    <FollowedProblem v-for="problem in problems" :problem="problem" class="shrink-0 grow-0 w-16" />
  </div>
</template>

<script setup lang="ts">
import FollowedProblem from '@/components/Problem/FollowedProblem.vue'
import { useResource } from '@/composables/useResource'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { ref, onMounted } from 'vue'
import type { ApiResource } from '@/types/models'

const { getResources } = useResource()
const { getResourceRelationsForResource } = useResourceRelations()
const problems = ref<(ApiResource & { bibliography: any[] })[]>([])

onMounted(async () => {
  const fetchedProblems = await getResources({ is_external: false, resource_type: 'pblm' })
  const problemsWithBibliography = await Promise.all(fetchedProblems.map(async (problem) => {
    const bibliography = await getResourceRelationsForResource(problem.id)
    const lastRelationAddedDate = bibliography.reduce((max, relation) => 
      new Date(relation.created_at) > max ? new Date(relation.created_at) : max, new Date(0))
    return { ...problem, bibliography, lastRelationAddedDate }
  }))
  
  problems.value = problemsWithBibliography.sort((b, a) => {
    return a.lastRelationAddedDate.getTime() - b.lastRelationAddedDate.getTime()
  })
})
</script>
