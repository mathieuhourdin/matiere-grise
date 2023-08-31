<template>
  <div class="flex">
    <router-link
      class="ml-auto w-12 bg-blue-400 rounded-square p-1 text-center text-4xl"
      :to="to"
    >
      <slot />
    </router-link>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  to: string,
}>();
</script>
<style>
.rounded-square {
  border-radius: 50%;
}
</style>
