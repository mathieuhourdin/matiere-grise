<template>
    <div class="mb-1">
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        :class="isActive ? 'text-blue-700 dark:text-blue-300' : ''"
      >
        <div class="flex items-center space-x-2">
          <component :is="iconComponent" class="w-5 h-5" />
          <span>{{ title }}</span>
        </div>
        <ChevronDownIcon
          class="w-4 h-4 transition-transform duration-200"
          :class="isExpanded ? 'rotate-0' : '-rotate-90'"
        />
      </button>
      <Transition name="slide">
        <div v-show="isExpanded" class="ml-4 mt-1 space-y-0.5">
          <slot />
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronDownIcon } from '@heroicons/vue/24/outline'
  import * as HeroIcons from '@heroicons/vue/24/outline'
  
  const props = defineProps<{
    title: string
    icon: string
    isExpanded: boolean
    isActive: boolean
  }>()
  
  defineEmits<{
    (e: 'toggle'): void
  }>()
  
  const iconComponent = computed(() => {
    return HeroIcons[props.icon as keyof typeof HeroIcons] || HeroIcons.FolderIcon
  })
  </script>
  
  <style scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.2s ease;
    max-height: 500px;
    overflow: hidden;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
  }
  </style>