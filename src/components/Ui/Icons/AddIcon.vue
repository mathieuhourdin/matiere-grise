<template>
  <div>
    <svg 
      aria-hidden="true" 
      role="img" 
      viewBox="0 0 24 24" 
      style="width: auto; height: 100%; display: block; fill: none; flex-shrink: 0; color: var(--c-icoTer);" 
      class="addRoundedIcon"
    >
      <!-- Rounded contour -->
      <rect 
        x="2" 
        y="2" 
        width="20" 
        height="20" 
        rx="5" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"
      />
      <!-- Vertical bar of the cross -->
      <rect 
        x="11" 
        y="6.5" 
        width="2" 
        height="11" 
        rx="1" 
        fill="currentColor"
      />
      <!-- Horizontal bar of the cross -->
      <rect 
        x="6.5" 
        y="11" 
        width="11" 
        height="2" 
        rx="1" 
        fill="currentColor"
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
</style>