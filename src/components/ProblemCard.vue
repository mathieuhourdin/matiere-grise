<template>
  <div class="border shadow-xl rounded m-2 p-4 h-72 w-60">
    <router-link :to="'/thought_outputs/' + problem.id">
      <div class="max-h-full">
        <img class="h-28 mx-auto mb-4" :src="problem.resource_image_url" />
        <div class="h-full">
          <div class="mb-2">{{ problem.resource_title }}</div>
          <div v-if="problemAuthor" class="text-2xs italic" style="margin-top: -8px">
            {{ problemAuthor.first_name }} {{ problemAuthor.last_name }}
          </div>
          <div class="text-2xs mb-auto">{{ formatText(problem.resource_subtitle) }}</div>
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
import { type Problem, type ThoughtInput, type User } from '@/types/models'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages'
import { onMounted, ref } from 'vue'
import { useUser } from '@/composables/useUser'

const props = defineProps<{
  problem: Problem
}>()

const formatDate = (date?: Date) => {
  if (!date) return ''
  return date.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}

const problemAuthor = ref<User | null>(null)

const formatText = (text: string) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}

const thoughtInputs = ref<ThoughtInput[]>([])
const { getThoughtInputUsagesForResource } = useThoughtInputUsages()
const loadThoughtInputs = async () => {
  if (!props.problem.id) return
  thoughtInputs.value = await getThoughtInputUsagesForResource(props.problem.id)
}

const { getUserById } = useUser()

const loadUser = async () => {
  if (!props.problem.interaction_user_id) return
  problemAuthor.value = await getUserById(props.problem.interaction_user_id)
}

onMounted(async () => {
  await loadThoughtInputs()
  await loadUser()
})
</script>
