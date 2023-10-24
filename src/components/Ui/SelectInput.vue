<template>
  <div>
    <label class="block text-2xs text-slate-800">{{ label }}</label>
    <select
      :value="modelValue"
      name="Stade d'écriture"
      class="text-xs w-full p-1 block rounded border-2 border-neutral-400"
      @input="(event) => emitChange(event)"
    >
      <option v-for="choice in choices" :key="choice.value" :value="choice.value">
        {{ displayFunction(choice) }}
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
