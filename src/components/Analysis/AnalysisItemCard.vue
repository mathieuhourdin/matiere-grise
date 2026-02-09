<template>
  <component
    :is="linkTo ? 'router-link' : 'div'"
    :to="linkTo ?? undefined"
    :class="containerClass"
  >
    <div class="flex flex-wrap items-center gap-2">
      <div class="text-lg font-bold text-slate-200">{{ title }}</div>
      <span
        v-if="badge"
        class="text-xs px-2 py-0.5 rounded-full border border-slate-600 text-slate-400"
      >
        {{ badge }}
      </span>
    </div>
    <div v-if="subtitle" class="text-sm text-slate-400 mt-1">{{ subtitle }}</div>
    <div v-if="content" class="text-sm text-slate-300 mt-2 whitespace-pre-line">{{ content }}</div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  content?: string
  badge?: string
  linkTo?: string | null
}>(), {
  title: '',
  subtitle: '',
  content: '',
  badge: '',
  linkTo: null
})

const containerClass = computed(() => {
  const base = 'mb-6 p-4 rounded-xl border border-slate-700 bg-slate-800/40 block'
  const hover = props.linkTo ? 'hover:bg-slate-700/60 hover:border-slate-600 transition-colors' : ''
  return `${base} ${hover}`.trim()
})
</script>
