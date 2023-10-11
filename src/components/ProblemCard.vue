<template>
  <div class="border shadow-xl rounded m-2 p-4 h-72 w-60">
    <router-link :to="'/thought_outputs/' + problem.id">
      <div class="max-h-full">
        <img class="h-28 mx-auto mb-4" :src="problem.image_url" />
        <div class="h-full">
          <div class="mb-2">{{ problem.title }}</div>
          <div v-if="problemAuthor" class="text-2xs italic" style="margin-top: -8px">
            {{ problemAuthor.first_name }} {{ problemAuthor.last_name }}
          </div>
          <div class="text-2xs mb-auto">{{ formatText(problem.subtitle) }}</div>
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
import { type ApiResource, type Interaction, type User } from '@/types/models'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages'
import { onMounted, ref } from 'vue'
import { useResource } from '@/composables/useResource'
import { useUser } from '@/composables/useUser'

const props = defineProps<{
  problem: ApiResource
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

const problemAuthorInteraction = ref<Interaction | null>(null)
const problemAuthor = ref<User | null>(null)

const formatText = (text: string) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}

const { getAuthorInteractionForResource } = useResource()
const thoughtInputs = ref<Interaction[]>([])
const { getThoughtInputUsagesForResource } = useThoughtInputUsages()
const loadThoughtInputs = async () => {
  if (!props.problem.id) return
  thoughtInputs.value = await getThoughtInputUsagesForResource(props.problem.id)
}

const { getUserById } = useUser()

const loadUser = async () => {
  problemAuthorInteraction.value = await getAuthorInteractionForResource(props.problem.id)
  if (!problemAuthorInteraction.value) return
  problemAuthor.value = await getUserById(problemAuthorInteraction.value.interaction_user_id)
}

onMounted(async () => {
  await loadThoughtInputs()
  await loadUser()
})
</script>
