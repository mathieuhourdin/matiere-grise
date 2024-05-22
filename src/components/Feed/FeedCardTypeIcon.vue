<template>
  <div class="flex">
    <div class="w-8 mr-1">
      <div v-if="interaction.interaction_type === 'outp'" title="Production">
        <ArrowLongRightIcon />
      </div>
      <div v-else-if="interaction.interaction_type === 'inpt'" title="Consommation">
        <ArrowLongLeftIcon />
      </div>
    </div>
    <div class="w-7">
      <div v-if="interaction.resource.resource_type === 'natc'" title="Article d'actualité">
        <NewspaperIcon class="w-full my-auto text-red-800" />
      </div>
      <div v-else-if="interaction.resource.resource_type === 'pblm'" title="Problématique">
        <QuestionMarkCircleIcon class="w-full my-auto text-blue-800" />
      </div>
      <div v-else title="Autre">
        <BookOpenIcon class="w-full my-auto text-red-800" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  MicrophoneIcon,
  WrenchIcon,
  PencilSquareIcon,
  ArrowDownOnSquareIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  interaction: Interaction
}>()
</script>
