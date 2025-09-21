<template>
  <div class="h-12 border-b border-slate-400 dark:border-gray-600 flex hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors duration-200">
    <router-link class="inline-block mx-4 w-max" @click="clickLink" :to="to">
      <div class="text-sm mt-2 text-gray-800 dark:text-gray-200">{{ title }}</div>
      <div v-if="subtitle" class="text-2xs text-gray-600 dark:text-gray-400 mb-auto">{{ subtitle }}</div>
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
