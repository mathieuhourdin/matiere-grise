<template>
  <div class="flex flex-col">
    <label class="block text-2xs text-slate-800">{{ label }}</label>
    <input
      class="border border-neutral-400 block h-full w-full rounded-md border-2 p-1 pl-2 text-sm"
      :value="modelValue"
      :placeholder="placeholder"
      @input="(event) => onInput(event)"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input'])
const props = withDefaults(defineProps<{
  label?: string
  modelValue?: string | Date | number
  placeholder?: string
  type?: string
}>(),
  {
    type: "text",
  }
)
const onInput = (event: any) => {
  emit('update:modelValue', event.target.value)
  emit('input', event.target.value)
}
</script>
