<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { onMounted } from 'vue'
import { useCategories } from'@/composables/useCategories'
import { useMenu } from '@/composables/useMenu'
const { menuOpen } = useMenu()
const { loadCategories } = useCategories()
onMounted(async () => await loadCategories())
</script>

<template>
  <AppHeader />
  <div class="flex">
    <SidebarMenu v-if="menuOpen" style="min-height: 800px" class="md:w-250px w-full absolute md:static" />
    <RouterView :style="{width: menuOpen ? '1450px' : '100%'}"/>
  </div>
</template>
