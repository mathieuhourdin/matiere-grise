<template>
  <div>
    <SeeThoughtInput v-if="thoughtInput" :thought-input="thoughtInput" class="m-2" />
  </div>
</template>

<script setup lang="ts">
import SeeThoughtInput from '@/components/ThoughtInput/SeeThoughtInput.vue'
import { ref, onMounted } from 'vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { type ApiInteraction } from '@/types/models'
const props = defineProps<{
  id: string
}>()

const thoughtInput = ref<null|ApiInteraction>(null)

const { getThoughtInput } = useThoughtInputs()

onMounted(async () => (thoughtInput.value = await getThoughtInput(props.id)))
</script>
