<template>
  <div class="overflow-hidden flex justify-between h-full" style="width: 100%">
    <SidebarMenu
      v-if="isSidebarMenuOpen"
      class="absolute md:relative h-full w-full md:static md:basis-1/6 md:shrink-0"
    />
    <div id="router-view" class="relative overflow-scroll h-full w-full">
      <RouterView class="" :key="routerViewKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
const { menuOpen } = useMenu()
const route = useRoute()

const routerViewKey = computed(() => {
  return route.meta.requiresRender === false ? route.path : route.fullPath
})

const isSidebarMenuOpen = computed(() => {
  return menuOpen.value
})
</script>
