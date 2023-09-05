<template>
  <div class="text-center mb-4">
    <router-link :to="articleLink">
      <img
        :src="imageUrl"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/1] object-cover object-center w-full"
        fit="cover"
        position="center"
      />
      <ProgressBar :progress-value="progress" class="w-1/3" />
      <div class="mt-3 text-xl font-bold">{{ title }}</div>
      <div class="opacity-70">{{ description }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { computed } from 'vue'
const props = defineProps<{
  uuid: String,
  title: String
  description: String
  imageUrl: String
  progress: Number
}>()
const articleLink = computed(() => {
  return '/articles/' + props.uuid
})
</script>
