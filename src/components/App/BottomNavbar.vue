<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-slate-200 dark:bg-elevated border-t border-slate-400 dark:border-gray-600 transition-colors duration-200">
    <div class="flex justify-around items-center h-16">
      <router-link
        to="/me/home"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200"
        :class="isMeRoute ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
      >
        <UserIcon class="w-6 h-6 mb-1" />
        <span class="text-xs">Moi</span>
      </router-link>
      
      <router-link
        to="/app/trace"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200"
        :class="isTraceRoute ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
      >
        <PencilSquareIcon class="w-6 h-6 mb-1" />
        <span class="text-xs">Écrire</span>
      </router-link>
      
      <router-link
        to="/social/feed"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200"
        :class="isSocialRoute ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
      >
        <UsersIcon class="w-6 h-6 mb-1" />
        <span class="text-xs">Social</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { UserIcon, UsersIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isMeRoute = computed(() => {
  return route.path.startsWith('/me')
})

const isSocialRoute = computed(() => {
  return route.path.startsWith('/social')
})

const isTraceRoute = computed(() => {
  return route.name === 'trace' || route.path.includes('/app/trace')
})
</script>