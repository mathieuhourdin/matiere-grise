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
        {{ choice.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  label: string
  choices: any[]
  modelValue: any
}>()
const emitChange = (event: any) => {
  emit('update:modelValue', event.target.value)
}
</script>
