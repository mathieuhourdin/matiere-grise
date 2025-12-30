<template>
  <div id="router-view" class="relative overflow-scroll h-full w-full">
    <RouterView class="" :key="routerViewKey" />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const routerViewKey = computed(() => {
  return route.meta.requiresRender === false ? route.path : route.fullPath
})
</script>
