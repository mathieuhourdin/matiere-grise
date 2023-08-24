<template>
  <div @click="emitClick()">
    <slot />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps<{
  value: String
}>()
const emitClick = () => {
  console.log('Click on tab')
  emit('click', props.value)
}
</script>
