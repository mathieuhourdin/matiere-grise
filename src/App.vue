<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import UsersSidebarList from '@/components/User/UsersSidebarList.vue'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import UiSnackbar from '@/components/Ui/UiSnackbar.vue'
import { onMounted, watch, computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useSnackbar } from '@/composables/useSnackbar'
import { useDarkMode } from '@/composables/useDarkMode'
import AudioRecordButton from '@/components/Ui/AudioRecordButton.vue'
const { menuOpen } = useMenu()
const { snackbar } = useSnackbar()
const { isDarkMode } = useDarkMode()

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
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <AppHeader class="overflow-auto" />
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
  </div>
  <UiSnackbar v-if="snackbar" :message="snackbar.message" :type="snackbar.type" />
  <AudioRecordButton class="absolute top-80 right-4"/>
</template>
