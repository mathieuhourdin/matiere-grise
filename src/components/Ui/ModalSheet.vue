<template>
  <div v-if="modalOpen" class="fixed top-0 left-0 w-full h-full z-10 bg-blend-darken bg-slate-500/50">
    <div class="max-w-xl overflow-y-scroll max-h-screen mb-10 bg-white mx-auto mt-6 p-4 rounded shadow"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from 'vue'
const props = withDefaults(
  defineProps<{
    open: boolean
  }>(),
  { open: false }
)
const modalOpen = ref(false)

onMounted(() => (modalOpen.value = props.open))
watch(toRefs(props).open, (newValue) => (modalOpen.value = newValue))
</script>
