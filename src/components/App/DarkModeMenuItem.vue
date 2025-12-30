<template>
  <div class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors duration-200">
    <div class="flex items-center space-x-2">
      <MoonIcon v-if="isDarkMode" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <SunIcon v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span class="text-sm text-gray-700 dark:text-gray-300">
        {{ isDarkMode ? 'Mode sombre' : 'Mode clair' }}
      </span>
    </div>
    <DarkModeToggle />
  </div>
</template>

<script setup lang="ts">
import DarkModeToggle from '@/components/Ui/DarkModeToggle.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const { isDarkMode } = useDarkMode()
</script>
```






