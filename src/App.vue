<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import UsersSidebarList from '@/components/User/UsersSidebarList.vue'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import UiSnackbar from '@/components/Ui/UiSnackbar.vue'
import { onMounted, watch, computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useSnackbar } from '@/composables/useSnackbar.ts'
const { menuOpen } = useMenu()
const { snackbar } = useSnackbar()

const route = useRoute()
const routerViewKey = computed(() => {
  return route.meta.requiresRender === false ? route.path : route.fullPath
})
const isUserSidebarListDisplayed = computed(() => {
  return route.name !== 'login' && route.name !== 'seeResource'
})
const isSidebarMenuOpen = computed(() => {
  return route.name !== 'login' && menuOpen.value
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppHeader class="overflow-auto" />
    <div class="overflow-hidden flex justify-between h-full" style="width: 100%">
      <SidebarMenu
        v-if="isSidebarMenuOpen"
        class="absolute md:relative h-full w-full md:static md:basis-1/6 md:shrink-0"
      />
      <div id="router-view" class="overflow-scroll h-full w-full">
        <RouterView class="h-full" :key="routerViewKey" />
      </div>
      <div v-if="isUserSidebarListDisplayed" class="md:basis-1/6 w-0 md:w-auto md:ml-3 md:shrink-0 overflow-y-scroll">
        <UsersSidebarList />
      </div>
    </div>
  </div>
  <UiSnackbar v-if="snackbar" :message="snackbar.message" :type="snackbar.type" />
</template>
