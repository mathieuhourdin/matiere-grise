<template>
  <div class="h-12 border-b border-slate-400 flex">
    <div class="ml-4 my-auto">
      <router-link @click="clickLink" :to="to"><slot /></router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
const props = defineProps<{
  to: string
}>()
const { isMobile, setMenuOpen } = useMenu()

const clickLink = () => {
  if (isMobile.value) setMenuOpen(false)
}
</script>
