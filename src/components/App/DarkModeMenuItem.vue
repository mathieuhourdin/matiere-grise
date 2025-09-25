<template>
  <div class="h-12 border-b border-slate-400 dark:border-gray-600 flex hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors duration-200">
    <div class="flex items-center justify-between w-full mx-4">
      <div class="flex flex-col">
        <div class="text-sm text-gray-800 dark:text-gray-200">{{ isDarkMode ? 'Mode sombre' : 'Mode clair' }}</div>
        <div class="text-2xs text-gray-600 dark:text-gray-400">{{ isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre' }}</div>
      </div>
      <DarkModeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkModeToggle from '@/components/Ui/DarkModeToggle.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDarkMode } = useDarkMode()
</script>






