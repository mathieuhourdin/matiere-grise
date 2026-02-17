<template>
  <div class="p-4 md:px-24">
    <div v-if="loading" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else-if="landmark">
      <div class="mb-6">
        <router-link
          to="/app/llm-calls"
          class="text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ← Back
        </router-link>
      </div>

      <h1 class="text-3xl font-bold mb-6">Landmark Details</h1>

      <!-- Base Info -->
      <div class="mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">

          <div class="flex items-center justify-between mb-3">
            <div>
          <div v-if="landmark.title" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Title</div>
            <div class="text-2xl font-bold">{{ landmark.title }}</div>
          </div>
          <div v-if="landmark.subtitle" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subtitle</div>
            <div class="text-lg">{{ landmark.subtitle }}</div>
          </div>
          </div>
          <div v-if="!isMobile">
          <HeatmapDisplay
            :days="relatedElementsHeatmapDays"
            :range-start="heatmapWindow.start"
            :range-end="heatmapWindow.end"
            empty-text="No dated elements found"
            month-locale="en-US"
            :weekday-labels="weekdayLabels"
            :show-legend="false"
            :show-max="false"
          />
          </div>

          </div>
          <div v-if="landmark.content">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Content</div>
            <div class="whitespace-pre-wrap text-sm">{{ landmark.content }}</div>
          </div>
        </div>
      </div>
      <!-- Related Elements Heatmap -->
      <div class="mb-6" v-if="isMobile &&landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements Activity</h2>
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <HeatmapDisplay
            :days="relatedElementsHeatmapDays"
            :range-start="heatmapWindow.start"
            :range-end="heatmapWindow.end"
            empty-text="No dated elements found"
            month-locale="en-US"
            :weekday-labels="weekdayLabels"
            legend-less-label="Less"
            legend-more-label="More"
          />
        </div>
      </div>

      <!-- Parent Landmarks -->
      <div class="mb-6" v-if="landmark.parent_landmarks && landmark.parent_landmarks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Parent Landmarks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            v-for="parent in visibleParentLandmarks"
            :key="parent.id"
            :to="`/app/landmarks/${parent.id}`"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Parent</div>
            <div class="text-base font-medium">{{ parent.title || 'Untitled' }}</div>
          </router-link>
        </div>
        <button
          v-if="hasMoreParentLandmarks && !showAllParentLandmarks"
          type="button"
          class="mt-3 text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          @click="showAllParentLandmarks = true"
        >
          Show all
        </button>
      </div>


      <!-- Related Elements -->
      <div class="mb-6" v-if="landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements</h2>
        <div class="space-y-4">
          <div
            v-for="element in landmark.related_elements"
            :key="element.id"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4"
          >
            <div class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">ID</div>
              <div class="text-sm text-gray-500 dark:text-gray-500">{{ element.id }}</div>
            </div>
            <div v-if="element.title" class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</div>
              <div class="text-lg font-medium">{{ element.title }}</div>
            </div>
            <div v-if="element.content">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Content</div>
              <div class="whitespace-pre-wrap text-sm">{{ element.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-2xl pt-10 text-red-600">Landmark not found</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HeatmapDisplay from '@/components/Heatmap/HeatmapDisplay.vue'
import { useLandmark, type LandmarkDetail } from '@/composables/useLandmark'
import { useMenu } from '@/composables/useMenu'

const { isMobile } = useMenu()
const { getLandmark } = useLandmark()

const props = defineProps<{
  id: string
}>()

const landmark = ref<LandmarkDetail | null>(null)
const loading = ref(true)
const showAllParentLandmarks = ref(false)
const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const HEATMAP_MONTH_WINDOW = 6

type HeatmapDay = {
  day: string
  value: number
}

const parentLandmarks = computed(() => landmark.value?.parent_landmarks ?? [])

const visibleParentLandmarks = computed(() => {
  if (showAllParentLandmarks.value) return parentLandmarks.value
  return parentLandmarks.value.slice(0, 4)
})

const hasMoreParentLandmarks = computed(() => parentLandmarks.value.length > 4)

const dayKeyFromDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toUtcDate = (rawDate: unknown): Date | null => {
  if (!rawDate) return null
  const parsed = new Date(String(rawDate))
  if (Number.isNaN(parsed.getTime())) return null
  const date = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()))
  if (Number.isNaN(date.getTime())) return null
  return date
}

const heatmapWindow = computed(() => {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (HEATMAP_MONTH_WINDOW - 1), 1))
  return { start, end }
})

const relatedElementsCountByDay = computed(() => {
  const counts = new Map<string, number>()
  const elements = landmark.value?.related_elements ?? []
  const { start, end } = heatmapWindow.value

  for (const element of elements) {
    const rawDate = (element as any).interaction_date ?? element.created_at
    const dayDate = toUtcDate(rawDate)
    if (!dayDate) continue
    if (dayDate < start || dayDate > end) continue
    const dayKey = dayKeyFromDate(dayDate)
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1)
  }

  return counts
})

const relatedElementsHeatmapDays = computed<HeatmapDay[]>(() => {
  return Array.from(relatedElementsCountByDay.value.entries()).map(([day, value]) => ({ day, value }))
})

onMounted(async () => {
  try {
    loading.value = true
    showAllParentLandmarks.value = false
    landmark.value = await getLandmark(props.id)
  } catch (error) {
    console.error('Error loading landmark:', error)
  } finally {
    loading.value = false
  }
})
</script>
