<template>
  <div class="flex">
    <router-link
      v-if="to"
      class="ml-auto w-12 rounded-square p-1 text-center text-4xl"
      :class="colorClass"
      :title="title"
      :to="to"
    >
      <slot />
    </router-link>
    <div
      v-else
      class="ml-auto w-12 rounded-square p-1 text-center text-4xl"
      :title="title"
      :class="colorClass"
      @click="emitClick"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const emit = defineEmits(['click'])
const props = defineProps<{
  to?: string
  color?: string
  title?: string
}>()

const colorClass = computed(() => {
  if (props.color === 'green') return { 'bg-green-400': true }
  if (props.color === 'red') return { 'bg-red-400': true }
  return { 'bg-blue-400': true }
})

const emitClick = () => {
  emit('click')
}
</script>
<style>
.rounded-square {
  border-radius: 50%;
}
</style>
