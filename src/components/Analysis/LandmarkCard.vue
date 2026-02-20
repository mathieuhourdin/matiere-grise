<template>
  <div :class="containerClass">
    <div class="flex flex-wrap items-center gap-2">
      <div class="text-sm font-semibold text-slate-200">{{ title }}</div>
      <span
        v-if="badge"
        class="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-600 text-slate-400"
      >
        {{ badge }}
      </span>
    </div>
    <div v-if="subtitle" class="text-xs text-slate-400 mt-1">{{ subtitle }}</div>
    <div v-if="content" class="text-xs text-slate-300 mt-1.5 whitespace-pre-line line-clamp-3">{{ content }}</div>
    <router-link
      v-if="linkTo"
      :to="linkTo"
      class="inline-block mt-2 text-xs underline text-slate-400 hover:text-slate-200 transition-colors"
    >
      voir plus
    </router-link>
  </div>
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
  const base = 'h-full p-3 rounded-lg border border-slate-700 bg-slate-800/40'
  const hover = props.linkTo ? 'hover:border-slate-600 transition-colors' : ''
  return `${base} ${hover}`.trim()
})
</script>
