<template>
  <div class="relative max-w-full">
    <div v-if="!center" class="absolute md:border h-full start-1/2" />
    <ThoughtInputCardWithPopup
      v-for="(thoughtInput, index) in thoughtInputs"
      :key="thoughtInput.id"
      class="mb-4 md:mb-1 mx-auto max-w-full max-w-fit p-1"
      :class="{ 'md:ml-0': (index % 2 == 0) && !center, 'md:mr-0': !center }"
      :thought-input="thoughtInput"
      @click="emitSelect(thoughtInput)"
    />
  </div>
</template>

<script setup lang="ts">
import ThoughtInputCardWithPopup from '@/components/ThoughtInputCardWithPopup.vue'
import { ThoughtInput } from '@/composables/useThoughtInputs.ts'
const emit = defineEmits(["select"])
const props = withDefaults(
  defineProps<{
    thoughtInputs: [ThoughtInput]
    center?: boolean
  }>(),
  {
    center: false
  }
)
const emitSelect = (thoughtInput) => {
  console.log("Select")
  emit('select', thoughtInput)
}
</script>
