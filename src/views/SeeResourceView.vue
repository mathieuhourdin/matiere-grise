<template>
  <div><ResourceComponent class="px-8" :id="id" /></div>
</template>

<script setup lang="ts">
import ResourceComponent from '@/components/Resource/ResourceComponent.vue'
const props = defineProps<{
  id: string
}>()
</script>
