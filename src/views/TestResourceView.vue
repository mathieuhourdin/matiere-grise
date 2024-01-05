<template>
  <div>
    <div v-if="resource">{{ resource.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useResource } from '@/composables/useResource'
const props = defineProps<{
  id: string
}>()

const { getResource } = useResource()
const resource = ref(null)

onMounted(async () => (resource.value = await getResource(props.id)))
</script>
