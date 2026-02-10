<template>
  <div class="flex gap-2 overflow-x-auto pb-1 min-w-0">
    <div
      v-for="lens in sortedLenses"
      :key="lens.id"
      @click="selectLens(lens)"
      :class="[
        'relative flex-shrink-0 px-3 py-2 pr-7 rounded-lg border cursor-pointer transition-all duration-200',
        currentLens?.id === lens.id
          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
          : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 text-slate-300'
      ]"
    >
      <button
        @click.stop="deleteLens(lens.id)"
        class="absolute top-1.5 right-1.5 p-0.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
        title="Supprimer cette lens"
      >
        <XMarkIcon class="w-3.5 h-3.5" />
      </button>
      <div class="text-xs font-medium">{{ lens.title || 'Lens ' + lens.id.slice(0, 8) }}</div>
      <div class="text-[10px] text-slate-500 mt-0.5">{{ formatDate(lens.created_at) }}</div>
    </div>

    <div
      v-if="!isLoadingLenses && sortedLenses.length === 0"
      class="flex-shrink-0 px-3 py-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-xs"
    >
      Aucune lens
    </div>

    <div
      v-if="isLoadingLenses"
      class="flex-shrink-0 px-3 py-2 text-slate-500 text-xs"
    >
      Chargement...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLens, type Lens } from '@/composables/useLens'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const {
  lenses,
  currentLens,
  isLoadingLenses,
  loadUserLenses,
  selectLens,
  deleteLens
} = useLens()

const sortedLenses = computed<Lens[]>(() => {
  return [...lenses.value].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA
  })
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

onMounted(async () => {
  await loadUserLenses()
})
</script>
