<template>
  <div>
    Coucou
    <SeeThoughtInput v-if="thoughtInput" :thought-input="thoughtInput" />
  </div>
</template>

<script setup lang="ts">
import SeeThoughtInput from '@/components/SeeThoughtInput.vue'
import { ref, onMounted } from 'vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'
const props = defineProps<{
  id: string
}>()

const thoughtInput = ref(null)

const { getThoughtInput } = useThoughtInputs()

onMounted(async () => (thoughtInput.value = await getThoughtInput(props.id)))
</script>
