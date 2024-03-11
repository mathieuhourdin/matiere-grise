<template>
  <div class="h-12 border-b border-slate-400 flex">
    <div class="mx-4 w-max">
      <router-link @click="clickLink" :to="to">
        <div class="mt-1">{{ title }}</div>
        <div v-if="subtitle" class="text-xs text-gray-600 inline-block mb-1">{{ subtitle }}</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
const props = defineProps<{
  to: string,
  title: string,
  subtitle?: string
}>()
const { isMobile, setMenuOpen } = useMenu()

const clickLink = () => {
  if (isMobile.value) setMenuOpen(false)
}
</script>
