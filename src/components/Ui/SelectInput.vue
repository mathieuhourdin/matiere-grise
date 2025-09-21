<template>
  <div class="flex flex-col">
    <label class="block text-2xs text-slate-800 dark:text-gray-200 transition-colors duration-200">{{ label }}</label>
    <select
      :value="modelValue"
      name="Stade d'écriture"
      class="text-sm h-full w-full p-1 pl-2 bg-inherit block rounded border-2 border-neutral-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors duration-200 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
      @input="(event) => emitChange(event)"
    >
      <option v-for="choice in choices" :key="choice.value" :value="choice.value" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        {{ $t(displayFunction(choice)) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
  defineProps<{
    label: string
    choices: any[]
    modelValue: any
    displayFunction: Function
  }>(),
  { displayFunction: (item) => item.text }
)
const emitChange = (event: any) => {
  console.log(event.target.value)
  emit('update:modelValue', event.target.value)
}
</script>
