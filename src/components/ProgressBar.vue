<template>
  <div class="bg-gray-200">
    <div
        class="h-2"
        :class="progressColor"
        :style="{ 'width': progressValue + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps<{
    progressValue: number,
  }>();
  const progressColor = computed(() => {
    if (props.progressValue > 70) return 'bg-green-400';
    if (props.progressValue > 50) return 'bg-orange-400';
    return 'bg-red-400';
  })
</script>
