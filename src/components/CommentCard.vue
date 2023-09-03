<template>
  <div class="bg-slate-100 border-2 p-4 m-1 rounded">
    <TextAreaInput class="w-full" :modelValue="modelValue" @update:modelValue="onInput" />
  </div>
</template>

<script setup lang="ts">
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  editing: boolean
  modelValue: string
}>()
const onInput = (event) => {
  emit('update:modelValue', event)
}
</script>
