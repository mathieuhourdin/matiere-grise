<template>
  <div ref="parentCard" class="border p-1.5">
    <div>
      <div v-if="isFetchedAuthor" class="flex mb-1.5">
        <UserAvatar :user="problemAuthor" />
        <div v-if="problemAuthor" class="text-xs italic my-auto ml-2">
          {{ problemAuthor.first_name }} {{ problemAuthor.last_name }}
        </div>
        <div v-else>Connectez vous pour voir l'auteur</div>
      </div>
      <div v-else class="animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"></div>
    </div>
    <div
      @click="page = (page + 1) % (problemContentSentencesList.length + 1)"
      class="relative h-3/5 mb-2 bg-gray-700"
    >
      <img
        v-if="page == 0"
        class="object-contain w-full h-full mt-auto mx-auto"
        :src="problem.image_url"
      />
      <div v-else class="h-full overflow-scroll bg-blue-100 p-1 pt-8 border">
        <div class="bg-blue-100 text-center my-auto">
          {{ problemContentSentencesList[page - 1] }}
        </div>
      </div>
      <div class="absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70">
        {{ pageRatio }}
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
import UserAvatar from '@/components/User/UserAvatar.vue'
import { type ApiResource, type Interaction, type User } from '@/types/models'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { onMounted, computed, ref } from 'vue'
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

const problemContentPerPage = (text: string, page: number) => {
  return text.length > 300 + page * 300
    ? text.slice(page * 300, (page + 1) * 300) + '...'
    : text.slice(page * 300, (page + 1) * 300)
}

const pageRatio = computed(() => `${page.value}/${problemContentSentencesList.value.length}`)

const problemContentSentencesList = computed(() => {
  const splittedContent = props.problem.content.replaceAll('?', '?.').split('.')
  let i = 0
  const result = []
  while (i < splittedContent.length - 1) {
    let size = 0
    let text = []
    if (splittedContent[i].length >= 270) {
      result.push(splittedContent[i].replaceAll('?.', '?'))
      i++
    } else {
      while (i < splittedContent.length && size + splittedContent[i].length < 270) {
        text.push(splittedContent[i])
        size += splittedContent[i].length
        i++
      }
      result.push(text.join('. ').replaceAll('?.', '?'))
    }
  }
  return result
})

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

const isFetchedAuthor = ref(false)
const loadUser = async () => {
  try {
  problemAuthorInteraction.value = await getAuthorInteractionForResource(props.problem.id)
  if (!problemAuthorInteraction.value) return
  problemAuthor.value = await getUserById(problemAuthorInteraction.value.interaction_user_id)
  } catch (error) {
    console.log(error)
  }
  isFetchedAuthor.value = true
}

const parentCard = ref(null)

onMounted(async () => {
  await loadThoughtInputs()
  await loadUser()
  const initialHeight = parentCard.value.offsetHeight
  parentCard.value.style.height = `${initialHeight}px`
})
</script>
