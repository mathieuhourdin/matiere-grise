<template>
  <div class="h-12 border-b border-slate-400 flex">
    <div class="ml-4 my-auto">
      <router-link @click="clickLink" :to="to">
        <div>{{ title }}</div>
        <div v-if="subtitle" class="text-2xs text-gray-600">{{ subtitle }}</div>
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
