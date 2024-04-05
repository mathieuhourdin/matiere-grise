<template>
  <div class="flex flex-col border p-1.5 overflow-auto">
    <div class="flex">
      <UserMini
        v-if="isFetchedAuthor"
        class="flex mb-1.5 h-8"
        :user="interactionAuthor"
        :secondText="formatDate(interaction.date)"
        :firstBottomText="getInteractionTypeName(interaction.interaction_type)"
        :secondBottomText="getResourceTypeNameFromCode(interaction.resource.resource_type)"
      />
      <div v-else class="animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"></div>
      <router-link :to="'/resources/' + interaction.resource.id + '/feed'" class="ml-auto"
        ><ArrowRightCircleIcon class="w-8"
      /></router-link>
    </div>
    <div
      @click="nextPage"
      class="overflow-auto relative w-full md:h-3/5 min-h-60 mb-2 bg-gray-700"
      ref="parentCard"
    >
      <img
        v-if="page == 0"
        class="overflow-auto object-contain w-full h-full mt-auto mx-auto"
        :src="interaction.resource.image_url"
      />
      <div
        v-else-if="page > 0 && page <= contextSentencesList.length"
        class="overflow-auto h-full overflow-scroll bg-red-100 p-1 pt-8 border"
      >
        <div class="bg-red-100 text-center text-sm my-auto">
          {{ contextSentencesList[page - 1] }}
        </div>
      </div>
      <div v-else class="overflow-auto h-full overflow-scroll bg-blue-100 p-1 pt-8 border">
        <div class="bg-blue-100 text-center text-sm my-auto">
          {{ resourceContentSentencesList[page - contextSentencesList.length - 1] }}
        </div>
      </div>
      <div class="absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70">
        {{ pageRatio }}
      </div>
    </div>
    <router-link class="" :to="'/thought_outputs/' + interaction.resource.id">
      <div class="">
        <div class="mb-2 font-bold text-sm">{{ interaction.resource.title }}</div>
        <div class="text-2xs mb-auto">{{ formatText(interaction.resource.subtitle) }}</div>
        <div class="flex mt-2">
          <div class="ml-auto text-2xs underline">{{ thoughtInputs.length }} inputs</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import UserMini from '@/components/User/UserMini.vue'
import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline'
import { type ApiResource, type Interaction, type User } from '@/types/models'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { onMounted, computed, ref } from 'vue'
import { useResource } from '@/composables/useResource'
import { useUser } from '@/composables/useUser'
import { textManagement } from '@/helpers'

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

const interactionAuthorInteraction = ref<Interaction | null>(null)
const interactionAuthor = ref<User | null>(null)

const problemContentPerPage = (text: string, page: number) => {
  if (!text) return ''
  return text.length > 300 + page * 300
    ? text.slice(page * 300, (page + 1) * 300) + '...'
    : text.slice(page * 300, (page + 1) * 300)
}

const nextPage = () => {
  page.value = (page.value + 1) % pagesCount.value
}
const pageRatio = computed(() => `${page.value + 1}/${pagesCount.value}`)

const pagesCount = computed(() => {
  return contextSentencesList.value.length + resourceContentSentencesList.value.length + 1
})

const resourceContentSentencesList = computed(() => {
  return textManagement.splitTextForPanel(props.interaction.resource.content)
})

const contextSentencesList = computed(() => {
  return textManagement.splitTextForPanel(props.interaction.context_comment)
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
    interactionAuthor.value = await getUserById(props.interaction.user_id)
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
