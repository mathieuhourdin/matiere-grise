<template>
  <div class="mt-2">
    <div class="mb-4 flex items-center justify-end gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800/70 transition-colors"
        @click="atelierMode = !atelierMode"
      >
        <span>Atelier</span>
        <span v-if="atelierMode" aria-hidden="true">✓</span>
      </button>
      <button
        v-if="atelierMode"
        type="button"
        class="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/70 hover:text-slate-100 transition-colors"
        @click="atelierMode = false"
      >
        Fermer
      </button>
    </div>

    <div class="relative overflow-hidden">
      <div
        :class="[
          'transition-[padding] duration-300',
          atelierMode ? 'lg:pr-[15rem]' : ''
        ]"
      >
        <TracesSection
          v-if="atelierMode"
          ref="traceSectionRef"
          class="mb-8"
        />

        <h3 class="text-xl font-bold mb-4">Entités de l'analyse</h3>
        <LandmarksDisplayGrid
          :landmarks="contextLandmarks"
          empty-text="Aucune entité"
        />

        <h3 class="text-xl font-bold mt-8 mb-4">Landmarks actuels</h3>
        <LandmarksDisplayGrid
          :landmarks="currentLandmarks"
          empty-text="Aucun landmark actuel"
        />
      </div>

      <transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <AtelierDrawer
          v-if="atelierMode"
          class="fixed inset-y-0 right-0 z-40 w-full max-w-[15rem] lg:absolute"
          :can-focus="canFocusTimeline"
          :can-today="canTodayTimeline"
          @focus="handleFocusTimeline"
          @today="handleTodayTimeline"
          @close="atelierMode = false"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import LandmarksDisplayGrid from '@/components/Analysis/LandmarksDisplayGrid.vue'
import TracesSection from '@/components/Trace/TracesSection.vue'
import AtelierDrawer from '@/components/Analysis/AtelierDrawer.vue'

const props = defineProps<{
  id?: string
}>()

const contextLandmarks = ref<any[]>([])
const currentLandmarks = ref<any[]>([])
const atelierMode = ref(false)
const traceSectionRef = ref<{
  scrollToFocus: () => Promise<void> | void
  scrollToToday: () => Promise<void> | void
  hasFocusTarget: () => boolean
  hasTodayTarget: () => boolean
} | null>(null)
const canFocusTimeline = computed(() => traceSectionRef.value?.hasFocusTarget?.() ?? false)
const canTodayTimeline = computed(() => traceSectionRef.value?.hasTodayTarget?.() ?? false)

const handleFocusTimeline = async () => {
  await traceSectionRef.value?.scrollToFocus?.()
}

const handleTodayTimeline = async () => {
  await traceSectionRef.value?.scrollToToday?.()
}

const loadLandscapeLandmarks = async () => {
  const analysisId = typeof props.id === 'string' ? props.id.trim() : ''
  if (!analysisId) {
    contextLandmarks.value = []
    currentLandmarks.value = []
    return
  }

  const [contextResult, currentResult] = await Promise.allSettled([
    fetchWrapper.get(`/analysis/${analysisId}/landmarks?kind=context`),
    fetchWrapper.get(`/analysis/${analysisId}/landmarks?kind=mentioned`)
  ])

  if (contextResult.status === 'fulfilled') {
    contextLandmarks.value = Array.isArray(contextResult.value.data) ? contextResult.value.data : []
  } else {
    console.error('Error fetching context landmarks:', contextResult.reason)
    contextLandmarks.value = []
  }

  if (currentResult.status === 'fulfilled') {
    currentLandmarks.value = Array.isArray(currentResult.value.data) ? currentResult.value.data : []
  } else {
    console.error('Error fetching current landmarks:', currentResult.reason)
    currentLandmarks.value = []
  }
}

onMounted(async () => {
  await loadLandscapeLandmarks()
})

watch(
  () => props.id,
  async () => {
    await loadLandscapeLandmarks()
  }
)
</script>
