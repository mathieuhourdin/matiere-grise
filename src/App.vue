<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
