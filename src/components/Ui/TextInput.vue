<template>
  <div class="m-4">
    <label class="block">{{ label }}</label>
    <input class="border block" :value="modelValue" :placeholder="placeholder" @input="event => onInput(event)" />
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
