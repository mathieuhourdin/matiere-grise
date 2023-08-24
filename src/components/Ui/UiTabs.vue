<template>
  <div>
    <slot @click="chooseValue(event)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: String
}>()
const chooseValue = () => {
  console.log("chooseValue");
};
</script>
