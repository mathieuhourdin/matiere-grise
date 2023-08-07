<template>
  <div class="text-center mb-4">
    <a>
      <img
        :src="imageUrl"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/1]"
        width=500
          />
      <ProgressBar :progress-value="progress" />
      <div class="mt-3 text-xl font-bold">{{title}}</div>
      <div class="opacity-70">{{description}}</div>
    </a>
  </div>
</template>

<script setup lang="ts">
  import ProgressBar from '@/components/ProgressBar.vue';
  const props = defineProps<{
    title: String,
    description: String,
    imageUrl: String,
    progress: Number,
  }>();

</script>

