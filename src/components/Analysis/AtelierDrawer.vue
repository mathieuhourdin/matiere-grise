<template>
  <aside class="h-full overflow-y-auto border-l border-slate-800 bg-slate-950/95 backdrop-blur-sm p-4 shadow-2xl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Atelier
      </h4>
      <button
        type="button"
        class="text-sm text-slate-400 underline hover:text-slate-200 transition-colors"
        @click="$emit('close')"
      >
        Fermer
      </button>
    </div>

    <section class="mb-5">
      <h5 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Lens
      </h5>
      <LensSelectorBar />
    </section>

    <section class="mb-5 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <h5 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Analyse
      </h5>
      <div class="mb-3 flex items-center gap-2">
        <button
          type="button"
          class="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canFocus"
          @click="$emit('focus')"
        >
          Focus
        </button>
        <button
          type="button"
          class="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canToday"
          @click="$emit('today')"
        >
          Aujourd'hui
        </button>
      </div>
      <div class="flex flex-col gap-2 text-sm">
        <button
          type="button"
          class="text-left text-slate-300 hover:text-slate-100 transition-colors"
        >
          Run next step
        </button>
        <button
          type="button"
          class="text-left text-slate-300 hover:text-slate-100 transition-colors"
        >
          Replay trace
        </button>
        <button
          type="button"
          class="text-left text-slate-300 hover:text-slate-100 transition-colors"
        >
          View steps
        </button>
        <router-link
          to="/app/llm-calls"
          class="text-left text-slate-300 hover:text-slate-100 transition-colors"
        >
          LLM calls
        </router-link>
      </div>
    </section>

    <section class="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <h5 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Debug
      </h5>
      <button
        type="button"
        class="text-left text-sm text-slate-300 hover:text-slate-100 transition-colors"
      >
        Errors / retries
      </button>
    </section>
  </aside>
</template>

<script setup lang="ts">
import LensSelectorBar from '@/components/Lens/LensSelectorBar.vue'

withDefaults(defineProps<{
  canFocus?: boolean
  canToday?: boolean
}>(), {
  canFocus: true,
  canToday: true
})

defineEmits<{
  (event: 'close'): void
  (event: 'focus'): void
  (event: 'today'): void
}>()
</script>
