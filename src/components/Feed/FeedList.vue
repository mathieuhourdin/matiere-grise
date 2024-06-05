<template>
  <div class="flex flex-col">
    <FeedCard
      v-for="(interaction, i) in filteredInteractions"
      class="md:mb-2 flex-grow md:rounded max-h-screen border-b-1 border-black"
      :interaction="interaction"
      :key="interaction.id"
    />
  </div>
</template>

<script setup lang="ts">
import FeedCard from '@/components/Feed/FeedCard.vue'
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
const { feedFilter } = useMenu()

const props = defineProps<{
  interactionsList: Problem[]
}>()

const filteredInteractions = computed(() => {
  return props.interactionsList.filter((interaction) => {
    if (feedFilter.value === 'production') {
      return (
        interaction.interaction_type === 'outp' &&
        !interaction.resource.is_external &&
        interaction.resource.resource_type !== 'pblm' &&
        !interaction.resource.is_external
      )
    } else if (feedFilter.value === 'draft') {
      return (
        interaction.interaction_type === 'outp' &&
        !interaction.resource.is_external &&
        (interaction.resource.maturing_state === 'drft' ||
          interaction.resource.maturing_state === 'rvew')
      )
    } else if (feedFilter.value === 'reviews') {
      return interaction.interaction_type === 'rvew'
    } else if (feedFilter.value === 'problem') {
      return interaction.resource.resource_type === 'pblm'
    } else if (feedFilter.value === 'biblio') {
      return interaction.interaction_type === 'inpt'
    }
    return interaction.interaction_type === 'inpt' || !interaction.resource.is_external
  })
})
</script>
