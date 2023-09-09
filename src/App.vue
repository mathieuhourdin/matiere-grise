<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<template>
  <AppHeader />
  <div class="flex">
    <SidebarMenu v-if="menuOpen" style="min-height: 800px" class="md:w-250px w-80pt absolute md:static" />
    <RouterView :style="{width: menuOpen ? '1450px' : '100%'}"/>
  </div>
</template>
