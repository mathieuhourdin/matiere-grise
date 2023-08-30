<template>
  <div class="m-4">
    <label class="block text-2xs text-slate-800">{{ label }}</label>
    <textarea class="border border-neutral-800 block h-full w-full" :value="modelValue" :placeholder="placeholder" @input="event => onInput(event)" />
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    label?: String,
    modelValue?: String,
    placeholder?: String,
  }>();
  const onInput = (event) => {
    emit("update:modelValue", event.target.value);
  };
</script>
