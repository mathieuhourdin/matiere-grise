<template>
  <div><ResourceComponent class="md:px-8 px-4" :id="id" /></div>
</template>

<script setup lang="ts">
import ResourceComponent from '@/components/Resource/ResourceComponent.vue'
const props = defineProps<{
  id: string
}>()
</script>
