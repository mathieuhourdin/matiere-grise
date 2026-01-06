<template>
  <div class="flex flex-col">
    <label class="block text-2xs text-slate-800 dark:text-gray-200">{{ label }}</label>
    <textarea
      class="border border-neutral-400 dark:border-gray-600 block h-full w-full rounded-md border-2 p-1 pl-2 text-sm bg-white dark:bg-elevated text-gray-900 dark:text-gray-100 transition-colors duration-200"
      :value="modelValue"
      :placeholder="placeholder"
      @input="event => onInput(event)"
    />
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    label?: string,
    modelValue?: string,
    placeholder?: string,
  }>();
  const onInput = (event: any) => {
    emit("update:modelValue", event.target.value);
  };
</script>
