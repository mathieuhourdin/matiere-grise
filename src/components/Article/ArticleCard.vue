<template>
  <div class="text-center mb-4">
    <router-link :to="articleLink">
      <img
        :src="imageUrl"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/1] object-cover object-center w-full"
        fit="cover"
        position="center"
      />
      <div class="flex">
        <ProgressBar v-if="progress" :progress-value="progress" class="m-2 w-1/3 mr-auto" />
        <router-link v-if="author" class="text-xs italic my-auto mr-2" :to="'/users/' + author.id"
          >{{ author.first_name }} {{ author.last_name }}</router-link
        >
      </div>
      <div class="mt-3 text-xl font-bold">{{ title }}</div>
      <div class="opacity-70">{{ subtitle }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { computed } from 'vue'
import { type User } from '@/types/models'
const props = defineProps<{
  uuid?: string
  title: string
  subtitle: string
  imageUrl: string
  progress?: number
  author?: User
}>()
const articleLink = computed(() => {
  if (!props.uuid) return ''
  return '/thought_outputs/' + props.uuid
})
</script>