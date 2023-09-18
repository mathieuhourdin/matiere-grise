<template>
  <div>
    <div>{{ thoughtInput.resource_title }}</div>
    <div>{{ thoughtInput.resource_author_name }}</div>
    <div>{{ thoughtInput.resource_type }}</div>
  </div>
</template>

<script setup lang="ts">
import { type ThoughtInput } from '@/types/models'

const props = defineProps<{
  thoughtInput: ThoughtInput
}>()
</script>
