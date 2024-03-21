<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import UiSnackbar from '@/components/Ui/UiSnackbar.vue'
import { onMounted } from 'vue'
import { useCategories } from'@/composables/useCategories'
import { useMenu } from '@/composables/useMenu'
import { useSnackbar } from '@/composables/useSnackbar.ts'
import { computed } from 'vue'
const { menuOpen } = useMenu()
const { loadCategories } = useCategories()
const { snackbar } = useSnackbar()
const route = useRoute()
const routerViewKey = computed(() => {
  return route.meta.requiresRender === false ? route.path : route.fullPath
})
onMounted(async () => await loadCategories())
computed
</script>

<template>
  <AppHeader />
  <div class="flex" style="width: 100%">
    <SidebarMenu v-if="menuOpen" style="min-height: 800px" class="absolute md:static w-full md:w-250px" />
    <RouterView class="flex-grow overflow-hidden" :key="routerViewKey"/>
  </div>
  <UiSnackbar v-if="snackbar" :message="snackbar.message" :type="snackbar.type" />
</template>
