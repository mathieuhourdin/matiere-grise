<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import SidebarMenu from '@/components/App/SidebarMenu.vue'
import UiSnackbar from '@/components/Ui/UiSnackbar.vue'
import { onMounted } from 'vue'
import { useCategories } from'@/composables/useCategories'
import { useMenu } from '@/composables/useMenu'
import { useSnackbar } from '@/composables/useSnackbar.ts'
const { menuOpen } = useMenu()
const { loadCategories } = useCategories()
const { snackbar } = useSnackbar()
onMounted(async () => await loadCategories())
</script>

<template>
  <AppHeader />
  <div class="flex">
    <SidebarMenu v-if="menuOpen" style="min-height: 800px" class="md:w-250px w-full absolute md:static" />
    <RouterView :style="{width: menuOpen ? '1450px' : '100%'}" :key="$route.fullPath"/>
  </div>
  <UiSnackbar v-if="snackbar" :message="snackbar.message" :type="snackbar.type" />
</template>
