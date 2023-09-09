<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
</script>

<template>
  <AppHeader />
  <div class="flex">
    <SidebarMenu style="min-height: 800px" class="md:w-250px w-80pt absolute md:static" />
    <RouterView style="width: 1450px"/>
  </div>
</template>
