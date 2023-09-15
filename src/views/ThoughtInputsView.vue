<template>
  <div class="m-4">
    <div>Derniers apports</div>
    <ThoughtInputsList :thought-inputs="thoughtInputs" />
  </div>
</template>

<script setup lang="ts">
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'
import { ref, onMounted } from 'vue'

const { getThoughtInputs } = useThoughtInputs()

const thoughtInputs = ref([])

onMounted(async () => {
  thoughtInputs.value = await getThoughtInputs()
})
</script>
