<template>
  <div>
    <FeedCard
      v-for="(interaction, i) in interactionsList"
      class="max-h-screen border-b-1 border-black"
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
