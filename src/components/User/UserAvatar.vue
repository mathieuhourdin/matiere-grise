<template>
  <div class="w-8">
    <img
      :src="!isSpy && user && user.profile_picture_url ? user.profile_picture_url : '/assets/spy-icon.svg'"
      class="border-2 border-slate-300 dark:border-zinc-700 rounded-full max-w-full aspect-[2/2] object-cover object-center w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { type User } from '@/types/models'
import SpyAvatar from '@/assets/spy-icon.svg'

const props = defineProps<{
  user?: User
  isSpy: boolean
}>()
</script>
