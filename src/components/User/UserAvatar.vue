<template>
  <div class="w-8">
    <img
      :src="user.profile_picture_url ? user.profile_picture_url : image_src"
      class="border-2 border-slate-300 dark:border-zinc-700 rounded-full max-w-full aspect-[2/2] object-cover object-center w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { type User } from '@/types/models'

const props = defineProps<{
  user: User
}>()
</script>
