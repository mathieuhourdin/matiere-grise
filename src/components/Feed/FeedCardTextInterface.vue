<template>
  <div
    v-if="interaction.interaction_type != 'inpt'"
    class="overflow-auto relative w-full md:h-4/5 h-full min-h-60 mb-2 bg-gray-700"
    ref="parentCard"
  >
    <img
      v-if="page == 0 && interaction.resource.image_url !== ''"
      class="overflow-auto object-contain w-full h-full mt-auto mx-auto"
      :src="interaction.resource.image_url"
      @load="fixHeight"
    />
    <div v-else-if="page == 0" class="bg-white h-full text-center flex items-center justify-center">
      <div>
        <div class="text-2xl text-black">
          {{ interaction.resource.title }}
        </div>
        <div class="text-lg text-bold mt-2">
          {{ interaction.resource.subtitle }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-full overflow-scroll p-1 pb-16 border flex items-center justify-center"
      :class="getTextPropertiesFromPage(page).class"
    >
      <div
        :class="getTextPropertiesFromPage(page).class"
        class="text-center text-sm my-auto text-white"
      >
        <div>
          <div class="text-bold mb-2">{{ getTextPropertiesFromPage(page).header }}</div>
          <div>
            {{ getTextPropertiesFromPage(page).text }}
          </div>
        </div>
      </div>
    </div>
    <div class="absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70">
      {{ pageRatio }}
    </div>
    <div class="absolute h-full w-full left-0 top-0 flex">
      <div class="w-1/2 h-full" @click="previousPage"></div>
      <div class="w-1/2 h-full" @click="nextPage"></div>
    </div>
  </div>
  <div v-else>
    <FeedCard
      v-if="resourceAuthorInteraction"
      :interaction="resourceAuthorInteraction"
      class="mx-1.5 mb-0.5 h-96 border-1 border border-slate-600 rounded"
    />
    <div v-else>
      <router-link :to="'/resources/' + interaction.resource.id">{{
        interaction.resource.title
      }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeedCard from '@/components/Feed/FeedCard.vue'
import { onMounted, computed, ref } from 'vue'
import { textManagement } from '@/helpers'
import { type Interaction } from '@/types/models'
import { useResource } from '@/composables/useResource'

const props = defineProps<{
  interaction: Interaction
}>()

const getTextPropertiesFromPage = (page) => {
  if (page > 0 && page <= contextSentencesList.value.length) {
    //display text from context (interaction)
    const text = contextSentencesList.value[page - 1]
    return {
      text: text.replace(/#/g, ''),
      header: page === 1 ? 'Commentaire : ' : null,
      class: {
        'font-black': text.charAt(0) === '#',
        'bg-gray-700': true
      }
    }
  } else {
    //display text from resource
    const text = resourceContentSentencesList.value[page - contextSentencesList.value.length - 1]
    return {
      text: text ? text.replace(/#/g, '') : '',
      header: page === contextSentencesList.value.length + 1 ? 'Contenu : ' : null,
      class: {
        'font-black': text && text.charAt(0) === '#',
        'bg-slate-700': true
      }
    }
  }
}

const page = ref<number>(0)
const nextPage = () => {
  page.value = (page.value + 1) % pagesCount.value
}
const previousPage = () => {
  if (page.value === 0) {
    page.value = pagesCount.value - 1
  } else {
    page.value = (page.value - 1) % pagesCount.value
  }
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
const fixHeight = () => {
  if (props.interaction.interaction_type != 'inpt' && props.interaction.resource.image_url !== '') {
    const initialHeight = parentCard.value.offsetHeight
    parentCard.value.style.height = `${initialHeight}px`
  }
}

const { getAuthorInteractionForResource } = useResource()
const resourceAuthorInteraction = ref(null)

const parentCard = ref(null)

onMounted(async () => {
  if (props.interaction.interaction_type != 'inpt' && props.interaction.resource.image_url === '' || props.interaction.resource.image_url === null) {
    //parentCard.value.style.height = '500px'
    page.value = 1
  }
  const authorInteraction = await getAuthorInteractionForResource(props.interaction.resource.id)
  if (authorInteraction) {
    authorInteraction.resource = props.interaction.resource
    authorInteraction.user_id = authorInteraction.interaction_user_id
    resourceAuthorInteraction.value = authorInteraction
  }
})
</script>u
