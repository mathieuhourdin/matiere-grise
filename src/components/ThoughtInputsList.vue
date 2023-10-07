<template>
  <div class="relative max-w-full">
    <div v-if="!center" class="absolute md:border h-full start-1/2" />
    <ThoughtInputCardWithPopup
      v-for="(thoughtInput, index) in sortedThoughtInputs(thoughtInputs)"
      :key="thoughtInput.id"
      class="mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1"
      :class="{ 'md:ml-0': index % 2 == 0 && !center, 'md:mr-0': !center }"
      :thought-input="thoughtInput"
      :usage-reason="getUsageReasonFromIndex(index)"
      @click="emitSelect(thoughtInput)"
    />
  </div>
</template>

<script setup lang="ts">
import ThoughtInputCardWithPopup from '@/components/ThoughtInputCardWithPopup.vue'
import { type ApiInteraction } from '@/types/models'
const emit = defineEmits(['select'])
const props = withDefaults(
  defineProps<{
    thoughtInputs: ApiInteraction[]
    usageReasons?: string[]
    center?: boolean
  }>(),
  {
    center: false
  }
)
const getUsageReasonFromIndex = (index: number): string | undefined => {
  if (!props.usageReasons) return undefined
  if (props.usageReasons.length !== props.thoughtInputs.length) return undefined
  return props.usageReasons[index]
}

const sortedThoughtInputs = (inputs: ApiInteraction[]) => {
  return inputs.sort((a: ApiInteraction, b: ApiInteraction) =>
    Number(b.interaction_date > a.interaction_date)
  )
}

const emitSelect = (thoughtInput: ApiInteraction) => {
  console.log('Select')
  emit('select', thoughtInput)
}
</script>
