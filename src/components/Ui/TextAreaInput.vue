<template>
  <div>
    <label class="block text-2xs text-slate-800">{{ label }}</label>
    <textarea class="border border-neutral-800 block h-full w-full" :value="modelValue" :placeholder="placeholder" @input="event => onInput(event)" />
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
