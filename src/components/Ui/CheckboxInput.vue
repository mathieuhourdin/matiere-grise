<template>
  <div>
    <input class="" type="checkbox" :id="checkboxId" v-model="isChecked" @change="handleChange" />
    <label :for="checkboxId" class="ml-2 text-2xs text-slate-800">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps } from 'vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  label: string
  modelValue: boolean 
}>()

const checkboxId = 'checkbox-' + Math.random().toString(36).substr(2, 9)
const isChecked = ref(toRefs(props).modelValue)
const handleChange = () => {
  isChecked.value = !isChecked.value // Toggle the checkbox state
  console.log(isChecked.value)
  emit('update:modelValue', !props.modelValue)
}

// Provide the generated checkbox ID and the computed checkbox state
</script>
