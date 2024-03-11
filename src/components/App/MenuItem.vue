<template>
  <div class="h-12 border-b border-slate-400 flex">
    <router-link class="inline-block mx-4 w-max" @click="clickLink" :to="to">
      <div class="text-sm mt-2">{{ title }}</div>
      <div v-if="subtitle" class="text-2xs text-gray-600 mb-auto">{{ subtitle }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
const props = defineProps<{
  to: string
  title: string
  subtitle?: string
}>()
const { isMobile, setMenuOpen } = useMenu()

const clickLink = () => {
  if (isMobile.value) setMenuOpen(false)
}
</script>
