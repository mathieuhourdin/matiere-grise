<template>
  <div
    @click="nextPage"
    class="overflow-auto relative w-full md:h-4/5 min-h-60 mb-2 bg-gray-700"
    ref="parentCard"
  >
    <img
      v-if="page == 0"
      class="overflow-auto object-contain w-full h-full mt-auto mx-auto"
      :src="interaction.resource.image_url"
    />
    <div
      v-else
      class="overflow-auto h-full overflow-scroll p-1 pt-8 border"
      :class="getTextPropertiesFromPage(page).class"
    >
      <div
        :class="getTextPropertiesFromPage(page).class"
        class="text-center text-sm my-auto text-white"
      >
        <div class="text-bold mb-2" >{{ getTextPropertiesFromPage(page).header }}</div>
        {{ getTextPropertiesFromPage(page).text }}
      </div>
    </div>
    <!--<div
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
    </div>-->
    <div class="absolute right-2 top-2 bg-gray-400 rounded-xl p-1 text-xs opacity-70">
      {{ pageRatio }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { textManagement } from '@/helpers'
import { type Interaction } from '@/types/models'

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
      text: text.replace(/#/g, ''),
      header: page === contextSentencesList.value.length + 1 ? 'Contenu : ' : null,
      class: {
        'font-black': text.charAt(0) === '#',
        'bg-slate-700': true
      }
    }
  }
}

const page = ref<number>(0)
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
const parentCard = ref(null)
onMounted(async () => {
  const initialHeight = parentCard.value.offsetHeight
  parentCard.value.style.height = `${initialHeight}px`
})
</script>
