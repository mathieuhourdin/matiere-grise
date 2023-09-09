<template>
  <div class="h-12 border-b border-slate-400 flex">
    <div class="ml-4 my-auto">
      <router-link :to="to"><slot /></router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
}>()
</script>
