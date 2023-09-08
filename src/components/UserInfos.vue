<template>
  <div class="text-center p-4 bg-slate-200">
    <div class="text-2xl bold">{{ user.first_name }} {{ user.last_name }}</div>
    <div>{{ user.handle }}</div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/composables/useUser.ts'
const props = defineProps<{
  user: User
}>()
</script>
