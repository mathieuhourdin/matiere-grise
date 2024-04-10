<template>
  <router-link :to="'/resources/' + problem.id + '/feed'" class="m-1">
    <div class="w-10 mx-auto">
      <img
        :src="problem.image_url"
        class="border-2 border-zinc-400 rounded-full max-w-full aspect-[2/2] object-cover object-center w-full"
      />
    </div>
    <div
      class="text-center overflow-hidden mt-1 text-xs"
      style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3"
    >
      {{ problem.title }}
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { type Problem } from '@/types/models'
import spyAvatar from '@/assets/spy-icon.svg'

const props = defineProps<{
  problem?: Problem
}>()
</script>
