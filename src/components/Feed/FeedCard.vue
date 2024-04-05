<template>
  <div class="flex flex-col border p-1.5 overflow-auto">
    <div>
      <div v-if="isFetchedAuthor" class="flex mb-1.5 h-8">
        <UserAvatar :user="interationAuthor" />
        <div class="h-full flex flex-col w-full">
          <div class="flex w-auto shrink overflow-auto">
            <div v-if="interationAuthor" class="text-xs font-semibold ml-2">
              {{ interationAuthor.first_name }} {{ interationAuthor.last_name }}
            </div>
            <div v-else class="text-xs italic ml-2">Connectez vous pour voir l'auteur</div>
            <div class="mx-1 my-auto rounded-full bg-gray-800 w-1 h-1"></div>
            <div class="text-2xs my-auto">{{ formatDate(interaction.date) }}</div>
          </div>
          <div class="flex ml-2 grow shrink-0 overflow-auto">
            <div class="text-2xs my-auto italic">{{ getInteractionTypeName(interaction.interaction_type) }}</div>
            <div class="mx-1 my-auto rounded-full bg-gray-800 w-1 h-1"></div>
            <div class="text-2xs my-auto italic">{{ getResourceTypeNameFromCode(interaction.resource.resource_type) }}</div>
          </div>
        </div>
      </div>
      <div v-else class="animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"></div>
    </div>
    <div
      @click="page = (page + 1) % (problemContentSentencesList.length + 1)"
      class="overflow-auto relative w-full md:h-3/5 min-h-60 mb-2 bg-gray-700"
      ref="parentCard"
    >
      <img
        v-if="page == 0"
        class="overflow-auto object-contain w-full h-full mt-auto mx-auto"
        :src="interaction.resource.image_url"
      />
      <div v-else class="overflow-auto h-full overflow-scroll bg-blue-100 p-1 pt-8 border">
        <div class="bg-blue-100 text-center text-xs my-auto">
          {{ problemContentSentencesList[page - 1] }}
        </div>
      </div>
      <div class="absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70">
        {{ pageRatio }}
      </div>
    </div>
    <router-link class="" :to="'/thought_outputs/' + interaction.resource.id">
      <div class="">
        <div class="mb-2 text-xs">{{ interaction.resource.title }}</div>
        <div class="text-2xs mb-auto">{{ formatText(interaction.resource.subtitle) }}</div>
        <div class="flex mt-2">
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
  interaction: ApiResource
}>()

const formatDate = (date?: Date) => {
  if (!date) return ''
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}

const getInteractionTypeName = (typeCode: string) => {
  return typeCode === 'outp' ? 'Production personnelle' : 'Bibliographie'
}

const getResourceTypeNameFromCode = (typeCode: string) => {
  switch (typeCode) {
    case 'pblm':
      return 'Problématique'
    case 'book':
      return 'Livre'
    case 'atcl':
      return 'Article'
    case 'ratc':
      return 'Article de recherche'
  }
  return typeCode
}

const page = ref<number>(0)

const interationAuthorInteraction = ref<Interaction | null>(null)
const interationAuthor = ref<User | null>(null)

const problemContentPerPage = (text: string, page: number) => {
  if (!text) return ''
  return text.length > 300 + page * 300
    ? text.slice(page * 300, (page + 1) * 300) + '...'
    : text.slice(page * 300, (page + 1) * 300)
}

const pageRatio = computed(() => `${page.value}/${problemContentSentencesList.value.length}`)

const problemContentSentencesList = computed(() => {
  if (!props.interaction.resource.content) return []
  const splittedContent = props.interaction.resource.content.replaceAll('?', '?.').split('.')
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
  if (!text) return ''
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}

const thoughtInputs = ref<Interaction[]>([])
const { getResourceRelationsForResource } = useResourceRelations()
const loadThoughtInputs = async () => {
  if (!props.interaction.id) return
  thoughtInputs.value = await getResourceRelationsForResource(props.interaction.resource.id)
}

const { getUserById } = useUser()

const isFetchedAuthor = ref(false)
const loadUser = async () => {
  try {
    interationAuthor.value = await getUserById(props.interaction.user_id)
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
