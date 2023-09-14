<template>
  <div class="border shadow-xl rounded m-2 p-4 h-72 w-60">
    <router-link :to="'/thought_outputs/' + problem.id">
      <div class="max-h-full">
        <img class="h-28 mx-auto mb-4" :src="problem.image_url" />
        <div class="h-full">
          <div class="mb-2">{{ problem.title }}</div>
          <div class="text-2xs italic" style="margin-top: -8px">
            {{ problem.owner_id }}
          </div>
          <div class="text-2xs mb-auto">{{ formatText(problem.description) }}</div>
          <div class="flex mt-2">
            <div class="text-2xs italic mt-auto">{{ formatDate(problem.created_at) }}</div>
            <div class="ml-auto text-2xs underline">{{ thoughtInputs.length }} inputs</div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Problem } from '@/composables/useProblem.ts'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  problem: Problem
}>()

const formatDate = (date: string) => {
  let formatDate = new Date(date.split(".")[0])
  return formatDate.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}

const formatText = (text) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}

const thoughtInputs = ref([])
const { getThoughtInputUsagesForThoughtOutput } = useThoughtInputUsages()
const loadThoughtInputs = async () => {
  thoughtInputs.value = await getThoughtInputUsagesForThoughtOutput(props.problem.id)
}

onMounted(() => loadThoughtInputs())

</script>
