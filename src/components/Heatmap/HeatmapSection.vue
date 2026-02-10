<template>
  <div v-if="compact" class="flex items-center">
    <button
      type="button"
      class="rounded-lg border border-slate-700 bg-slate-900/60 p-2.5 hover:border-slate-500 transition-colors"
      :title="'Voir la heatmap'"
      @click="openModal"
    >
      <HeatmapDisplay
        compact
        :days="heatmap"
        :loading="loading"
        title="Activité"
        empty-text="Aucune donnée"
        month-locale="fr-FR"
        :hide-first-compact-month-label="true"
        :compact-weeks-limit="props.compactWeeksLimit"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[120] flex items-center justify-center p-40"
      >
        <div class="absolute inset-0 bg-slate-950/70" @click="closeModal"></div>
        <div class="relative z-10 w-[min(98vw,1600px)] max-h-[95vh] overflow-auto">
          <div class="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-slate-200">Activité</h2>
              <div class="flex items-center gap-3">
                <div class="text-xs text-slate-500" v-if="maxValue > 0">Max: {{ maxValue }}</div>
                <button
                  type="button"
                  class="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800"
                  @click="closeModal"
                >
                  Fermer
                </button>
              </div>
            </div>

            <HeatmapDisplay
              :days="heatmap"
              :loading="loading"
              :show-max="false"
              empty-text="Aucune donnée"
              month-locale="fr-FR"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
    <HeatmapDisplay
      :days="heatmap"
      :loading="loading"
      title="Activité"
      empty-text="Aucune donnée"
      month-locale="fr-FR"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import HeatmapDisplay from '@/components/Heatmap/HeatmapDisplay.vue'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'

type HeatmapDay = {
  day: string
  value: number
}

const { user } = useUser()
const { launchSnackbar } = useSnackbar()
const props = withDefaults(defineProps<{
  compact?: boolean
  compactWeeksLimit?: number | null
}>(), {
  compact: false,
  compactWeeksLimit: 25
})

const loading = ref(false)
const heatmap = ref<HeatmapDay[]>([])
const isModalOpen = ref(false)

const maxValue = computed(() => {
  if (heatmap.value.length === 0) return 0
  return Math.max(...heatmap.value.map((h) => h.value || 0))
})

const openModal = () => {
  if (!props.compact) return
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const loadHeatmap = async () => {
  if (!user.value?.id) return
  loading.value = true
  try {
    const response = await fetchWrapper.get(`/users/${user.value.id}/heatmaps`)
    heatmap.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching heatmaps:', error)
    launchSnackbar(`Error loading heatmap: ${error}`, 'error')
    heatmap.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadHeatmap()
})
</script>
