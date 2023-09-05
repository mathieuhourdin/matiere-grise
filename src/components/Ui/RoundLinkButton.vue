<template>
  <div class="flex">
    <router-link
      v-if="to"
      class="ml-auto w-12 bg-blue-400 rounded-square p-1 text-center text-4xl"
      :to="to"
    >
      <slot />
    </router-link>
    <div
      v-else
      class="ml-auto w-12 bg-blue-400 rounded-square p-1 text-center text-4xl"
      @click="emitClick"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps<{
  to?: string
}>()
const emitClick = () => {
  emit('click')
}
</script>
<style>
.rounded-square {
  border-radius: 50%;
}
</style>
