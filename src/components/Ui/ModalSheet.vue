<template>
  <div
    tabindex="0"
    @keyup.esc="emit('close')"
    v-if="modalOpen"
    class="fixed top-0 left-0 w-full h-full z-10 bg-slate-500/50 dark:bg-gray-600/50"
    @click="emit('close')"
  >
    <div
      class="overflow-y-scroll bg-white dark:bg-elevated mx-auto mt-6 p-4 rounded shadow"
      :class="props.maxWidth + ' ' + props.maxHeight"
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
    maxWidth?: string
    maxHeight?: string
  }>(),
  { open: false, maxWidth: 'max-w-xl', maxHeight: 'max-h-screen' }
)
const modalOpen = ref(false)

onMounted(() => {
  modalOpen.value = props.open
})
watchEffect(() => {
  const closeOnEscape = (event: any) => {
    // Check if the event target is a form element (input, textarea, select, etc.)
    const isFormElement = event.target && (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.tagName === 'SELECT' ||
      event.target.isContentEditable
    )

    // Only close on Enter if it's not from a form element
    if (event.key === 'Enter' && isFormElement) {
      return // Don't close modal when Enter is pressed in form elements
    }

    if (
      event.key === 'Escape' ||
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
