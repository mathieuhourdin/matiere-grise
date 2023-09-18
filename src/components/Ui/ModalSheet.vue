<template>
  <div
    tabindex="0"
    @keyup.esc="emit('close')"
    v-if="modalOpen"
    class="fixed top-0 left-0 w-full h-full z-10 bg-slate-500/50"
    @click="emit('close')"
  >
    <div
      class="max-w-xl overflow-y-scroll max-h-screen mb-10 bg-white mx-auto mt-6 p-4 rounded shadow"
      @click.stop=""
    >
      <div class="flex">
        <div class="ml-auto" @click="emit('close')">x</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, toRefs, watch, onMounted } from 'vue'
const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    open: boolean
  }>(),
  { open: false }
)
const modalOpen = ref(false)

onMounted(() => {
  modalOpen.value = props.open
})
watchEffect(() => {
  const closeOnEscape = (event) => {
    if (
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === 'Esc' ||
      event.keyCode === 27
    ) {
      // Call the closeModal method when ESC is pressed
      emit('close')
    }
  }

  window.addEventListener('keydown', closeOnEscape)

  return () => {
    // Remove the event listener when the component is unmounted
    window.removeEventListener('keydown', closeOnEscape)
  }
})

watch(toRefs(props).open, (newValue) => (modalOpen.value = newValue))
</script>
