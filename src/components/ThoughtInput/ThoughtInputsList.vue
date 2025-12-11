<template>
  <div class="relative max-w-full">
    <div v-if="!center" class="absolute md:border h-full start-1/2 -z-10 border-gray-300 dark:border-gray-600" />
    <ThoughtInputCardWithPopup
      v-for="(contextualResource, index) in sortedThoughtInputs(contextualResources)"
      :key="contextualResource.id"
      class="mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1"
      :class="{ 'md:ml-0': index % 2 == 0 && !center, 'md:mr-0': !center }"
      :thought-input="contextualResource"
      @click="emitSelect(contextualResource)"
      :is-disabled="linksDisabled"
      :open="open"
    />
  </div>
</template>

<script setup lang="ts">
import ThoughtInputCardWithPopup from '@/components/ThoughtInput/ThoughtInputCardWithPopup.vue'
import { type ContextualResource } from '@/types/models'
const emit = defineEmits(['select'])
const props = withDefaults(
  defineProps<{
    contextualResources: ContextualResource[]
    center?: boolean
    linksDisabled?: boolean
    open?: boolean
  }>(),
  {
    center: false,
    linksDisabled: false,
    open: false
  }
)

const sortedThoughtInputs = (inputs: ContextualResource[]) => {
  return inputs.sort((a: ContextualResource, b: ContextualResource) => Number(b.date > a.date))
}

const emitSelect = (thoughtInput: ContextualResource) => {
  console.log('Select')
  emit('select', thoughtInput)
}
</script>
