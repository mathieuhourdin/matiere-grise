<template>
  <div class="flex flex-col py-1.5 overflow-auto dark:border-gray-600 border-t border-black">
    <div class="flex mx-1.5">
      <UserMini
        v-if="isFetchedAuthor"
        class="flex mb-1.5 h-8"
        :user="interactionAuthor"
        :secondText="formatDate(interaction.date)"
        :firstBottomText="getInteractionTypeName(interaction.interaction_type)"
        :secondBottomText="$t(getResourceTypeNameFromCode(interaction.resource.resource_type))"
      />
      <div v-else class="animate-pulse w-2/3 bg-gradient-to-r from-slate-600 h-8 mb-1.5"></div>
      <!--<FeedCardTypeIcon :interaction="interaction" class="ml-auto" />-->
    </div>
    <FeedCardTextInterface class="border-1 border-black" :interaction="interaction" />

    <div v-if="interaction.interaction_type != 'inpt'" class="flex mx-1.5">
      <div title="Coming Soon ;)" class="w-6"><HeartIcon class="w-full my-auto" /></div>
      <div title="Coming Soon ;)" class="w-6"><PaperAirplaneIcon class="w-full my-auto" /></div>
      <router-link :to="'/resources/' + interaction.resource.id + '/feed'" class="ml-auto"
        ><ArrowRightCircleIcon class="w-8"
      /></router-link>
    </div>
    <div v-if="interaction.interaction_type != 'inpt'" class="flex mx-1.5">
      <div class="text-2xs">{{ Math.floor(Math.random() * 100) }} likes</div>
      <router-link
        :to="'/resources/' + interaction.resource.id + '/feed'"
        class="ml-auto text-2xs underline"
      >
        {{ thoughtInputs.length }} relations
      </router-link>
    </div>
    <router-link v-if="interaction.interaction_type != 'inpt'" class="mx-1.5" :to="'/resources/' + interaction.resource.id">
      <div class="">
        <div class="mb-2 font-bold text-sm">{{ interaction.resource.title }}</div>
        <div class="text-2xs mb-auto">{{ formatText(interaction.resource.subtitle) }}</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import UserMini from '@/components/User/UserMini.vue'
import FeedCardTypeIcon from '@/components/Feed/FeedCardTypeIcon.vue'
import FeedCardTextInterface from '@/components/Feed/FeedCardTextInterface.vue'
import { ArrowRightCircleIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
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

const { resourceTypeOptions, getAuthorInteractionForResource } = useResource()
const getResourceTypeNameFromCode = (typeCode: string) => {
  return resourceTypeOptions.find((option) => option.value === typeCode).text
}

const interactionAuthorInteraction = ref<Interaction | null>(null)
const interactionAuthor = ref<User | null>(null)

const problemContentPerPage = (text: string, page: number) => {
  if (!text) return ''
  return text.length > 300 + page * 300
    ? text.slice(page * 300, (page + 1) * 300) + '...'
    : text.slice(page * 300, (page + 1) * 300)
}

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
  if (!props.interaction.user_id) {
    const interactionAuthorId = await getAuthorInteractionForResource(props.interaction.resource.id)
    interactionAuthor.value = await getUserById(interactionAuthorId.value) 
  } else {
    try {
      interactionAuthor.value = await getUserById(props.interaction.user_id)
    } catch (error) {
      console.log(error)
    }
    isFetchedAuthor.value = true
  }
}

onMounted(async () => {
  await loadThoughtInputs()
  await loadUser()
})
</script>
