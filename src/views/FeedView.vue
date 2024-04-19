<template>
  <div class="mt-1">
    <FollowedProblemsList
      class="overflow-scroll mb-2 md:mx-8"
      style="scrollbar-width: none; -ms-overflow-style: none"
    />
    <FeedList :interactions-list="contextualResources" class="md:w-96 mx-auto" />
  </div>
</template>
<script setup lang="ts">
import FeedList from '@/components/Feed/FeedList.vue'
import FollowedProblemsList from '@/components/Problem/FollowedProblemsList.vue'
import { useProblem } from '@/composables/useProblem'
import { useMenu } from '@/composables/useMenu'
import { computed, onMounted, ref } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { type Resource, type Category } from '@/types/models'
import { useInteraction } from '@/composables/useInteraction'

/// ThoughtInputs ///

const { getReadAndWriteInteractions } = useInteraction()
const { feedFilter } = useMenu()
const interactions = ref<ApiInteraction[]>([])
const contextualResources = computed(() => {
  const contextual = interactions.value
    .map((interaction) => {
      return {
        resource: interaction.resource,
        date: interaction.interaction_date,
        user_id: interaction.interaction_user_id,
        context_comment: interaction.interaction_comment,
        progress: interaction.interaction_progress,
        ...interaction
      }
    })
    .sort((a, b) => 0.5 - Math.random())
  return contextual.filter((interaction) => {
    if (feedFilter.value === "production") {
      return interaction.interaction_type === "outp" && !interaction.resource.is_external && interaction.resource.resource_type !== "pblm"
    } else if (feedFilter.value === "problem") {
      return interaction.resource.resource_type === "pblm"
    } else if (feedFilter.value === "biblio") {
      return interaction.interaction_type === "inpt"
    }
    return true
  })
})
const loadInteractions = async () => (interactions.value = await getReadAndWriteInteractions())

onMounted(async () => {
  await loadInteractions()
})
</script>
