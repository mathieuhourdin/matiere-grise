<template>
  <div class="flex flex-col">
    <FeedCard
      v-for="(interaction, i) in interactionsList"
      class="md:mb-2 flex-grow md:rounded max-h-screen border-b-1 border-black"
      :interaction="interaction"
    />
  </div>
</template>

<script setup lang="ts">
import FeedCard from '@/components/Feed/FeedCard.vue'

const props = defineProps<{
  interactionsList: Problem[]
}>()
</script>
