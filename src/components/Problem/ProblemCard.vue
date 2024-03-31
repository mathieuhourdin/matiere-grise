<template>
  <div class="border p-4">
    <div v-if="problemAuthor" class="text-2xs italic mb-2">
      {{ problemAuthor.first_name }} {{ problemAuthor.last_name }}
    </div>
    <div @click="page = 1" class="h-3/5 mb-2 bg-gray-700">
      <img v-if="page == 0" class="max-h-full mx-auto" :src="problem.image_url" />
      <div v-else class="max-h-40 overflow-scroll bg-white p-1 rounded border">
        <div class="bg-white">{{ problem.content }}</div>
      </div>
    </div>
    <router-link :to="'/thought_outputs/' + problem.id">
      <div class="">
        <div class="mb-2">{{ problem.title }}</div>
        <div class="text-2xs mb-auto">{{ formatText(problem.subtitle) }}</div>
        <div class="flex mt-2">
          <div class="text-2xs italic mt-auto">{{ formatDate(problem.created_at) }}</div>
          <div class="ml-auto text-2xs underline">{{ thoughtInputs.length }} inputs</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { type ApiResource, type Interaction, type User } from '@/types/models'
import { useResourceRelations } from '@/composables/useResourceRelations'
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

const page = ref<number>(0)

const problemAuthorInteraction = ref<Interaction | null>(null)
const problemAuthor = ref<User | null>(null)

const formatText = (text: string) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}

const { getAuthorInteractionForResource } = useResource()
const thoughtInputs = ref<Interaction[]>([])
const { getResourceRelationsForResource } = useResourceRelations()
const loadThoughtInputs = async () => {
  if (!props.problem.id) return
  thoughtInputs.value = await getResourceRelationsForResource(props.problem.id)
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
