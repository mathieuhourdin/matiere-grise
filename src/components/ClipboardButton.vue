<template>
  <div>
    <ClipboardIcon
      @click="copyText"
      :class="{ 'text-slate-400': textCopied }"
    />
  </div>
</template>

<script setup lang="ts">
import { ClipboardIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps<{
  text: string
}>()

const textCopied = ref<boolean>(false)

const { launchSnackbar } = useSnackbar()
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    textCopied.value = true
    launchSnackbar('Text copied to clipboard', 'success')
    setTimeout(() => (textCopied.value = false), 2000)
  } catch (err) {
    console.log(`Error with copy : ${err}`)
  }
}
</script>
