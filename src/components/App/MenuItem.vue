<template>
  <router-link
    :to="to"
    @click="clickLink"
    class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
    :class="isActive
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
      : 'text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'"
  >
    <component v-if="icon" :is="iconComponent" class="w-4 h-4 flex-shrink-0" />
    <span class="truncate">{{ title }}</span>
    <div
      v-if="isActive"
      class="ml-auto w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"
    ></div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import * as HeroIcons from '@heroicons/vue/24/outline'

const props = defineProps<{
  to: string
  title: string
  icon?: string
  isActive?: boolean
}>()

const { isMobile, setMenuOpen } = useMenu()

const iconComponent = computed(() => {
  if (!props.icon) return null
  return HeroIcons[props.icon as keyof typeof HeroIcons] || null
})

const clickLink = () => {
  if (isMobile.value) setMenuOpen(false)
}
</script>
