<template>
  <div class="overflow-hidden flex justify-between h-full" style="width: 100%">
    <SidebarMenu
      v-if="isSidebarMenuOpen"
      class="absolute md:relative h-full w-full md:static md:basis-1/6 md:shrink-0"
    />
    <div id="router-view" class="relative overflow-scroll h-full w-full">
      <RouterView class="" :key="routerViewKey" />
    </div>
    <div v-if="isUserSidebarListDisplayed" class="md:basis-1/6 w-0 md:w-auto md:ml-3 md:shrink-0 overflow-y-scroll dark:border-gray-600 border-t border-black">
      <UsersSidebarList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import UsersSidebarList from '@/components/User/UsersSidebarList.vue'
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'

const route = useRoute()
const { menuOpen } = useMenu()

const routerViewKey = computed(() => {
  return route.meta.requiresRender === false ? route.path : route.fullPath
})

const isUserSidebarListDisplayed = computed(() => {
  return route.name !== 'seeResource'
})

const isSidebarMenuOpen = computed(() => {
  return menuOpen.value
})
</script>
