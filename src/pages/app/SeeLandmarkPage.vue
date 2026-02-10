<template>
  <div class="p-4 md:px-8">
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
          <div v-if="landmark.title" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Title</div>
            <div class="text-2xl font-bold">{{ landmark.title }}</div>
          </div>
          <div v-if="landmark.subtitle" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subtitle</div>
            <div class="text-lg">{{ landmark.subtitle }}</div>
          </div>
          <div v-if="landmark.content">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Content</div>
            <div class="whitespace-pre-wrap text-sm">{{ landmark.content }}</div>
          </div>
        </div>
      </div>

      <!-- Parent Landmarks -->
      <div class="mb-6" v-if="landmark.parent_landmarks && landmark.parent_landmarks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Parent Landmarks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="parent in landmark.parent_landmarks"
            :key="parent.id"
            :to="`/app/landmarks/${parent.id}`"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Parent</div>
            <div class="text-base font-medium">{{ parent.title || 'Untitled' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">ID: {{ parent.id }}</div>
          </router-link>
        </div>
      </div>

      <!-- Related Elements Heatmap -->
      <div class="mb-6" v-if="landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements Activity</h2>
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div v-if="relatedElementsHeatmapWeeks.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
            No dated elements found
          </div>
          <div v-else>
            <div class="flex gap-2 overflow-x-auto">
              <div class="grid grid-rows-7 gap-1 pr-2 pt-5 text-[10px] text-gray-500 dark:text-gray-400">
                <div v-for="label in weekdayLabels" :key="label" class="h-4 flex items-center justify-end leading-none">
                  {{ label }}
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex gap-1 h-4 text-xs text-gray-500 dark:text-gray-400">
                  <div
                    v-for="(week, wIdx) in relatedElementsHeatmapWeeks"
                    :key="`landmark-month-${wIdx}-${week.weekStart}`"
                    class="w-4"
                  >
                    {{ week.monthLabel }}
                  </div>
                </div>
                <div class="flex gap-1">
                  <div
                    v-for="(week, wIdx) in relatedElementsHeatmapWeeks"
                    :key="`landmark-week-${wIdx}-${week.weekStart}`"
                    class="grid grid-rows-7 gap-1"
                  >
                    <div
                      v-for="day in week.days"
                      :key="`landmark-day-${day.dateStr}`"
                      class="w-4 h-4 rounded-sm border border-slate-300 dark:border-zinc-700"
                      :class="relatedElementsHeatClass(day.value)"
                      :title="`${day.dateStr}: ${day.value} element(s)`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-sm border border-slate-300 dark:border-zinc-700 bg-slate-200 dark:bg-zinc-800"></span>
                <span class="w-3 h-3 rounded-sm border border-emerald-900 bg-emerald-900/50"></span>
                <span class="w-3 h-3 rounded-sm border border-emerald-800 bg-emerald-800/70"></span>
                <span class="w-3 h-3 rounded-sm border border-emerald-700 bg-emerald-700/90"></span>
                <span class="w-3 h-3 rounded-sm border border-emerald-600 bg-emerald-600"></span>
              </div>
              <span>More</span>
              <span v-if="relatedElementsHeatmapMax > 0" class="ml-2">Max: {{ relatedElementsHeatmapMax }}</span>
            </div>
          </div>
        </div>
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
            <div v-if="element.subtitle" class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Subtitle</div>
              <div class="text-base">{{ element.subtitle }}</div>
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
import { useLandmark, type LandmarkDetail } from '@/composables/useLandmark.ts'

const { getLandmark } = useLandmark()

const props = defineProps<{
  id: string
}>()

const landmark = ref<LandmarkDetail | null>(null)
const loading = ref(true)
const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const HEATMAP_MONTH_WINDOW = 4

type HeatmapCell = {
  date: Date
  dateStr: string
  value: number
}

type HeatmapWeek = {
  weekStart: string
  monthLabel: string
  days: HeatmapCell[]
}

const dayKeyFromDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDayKey = (dayKey: string): Date => {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const startOfWeekMonday = (date: Date): Date => {
  const day = date.getUTCDay()
  const diff = (day + 6) % 7
  return new Date(date.getTime() - diff * 86400000)
}

const endOfWeekSunday = (date: Date): Date => {
  const day = date.getUTCDay()
  const diff = 6 - ((day + 6) % 7)
  return new Date(date.getTime() + diff * 86400000)
}

const toDayKey = (rawDate: unknown): string | null => {
  if (!rawDate) return null
  const date = new Date(String(rawDate))
  if (Number.isNaN(date.getTime())) return null
  return dayKeyFromDate(date)
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
    const dayKey = toDayKey(rawDate)
    if (!dayKey) continue
    const dayDate = parseDayKey(dayKey)
    if (dayDate < start || dayDate > end) continue
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1)
  }

  return counts
})

const relatedElementsHeatmapMax = computed(() => {
  const values = Array.from(relatedElementsCountByDay.value.values())
  if (values.length === 0) return 0
  return Math.max(...values)
})

const relatedElementsHeatmapWeeks = computed<HeatmapWeek[]>(() => {
  const { start, end } = heatmapWindow.value
  const gridStart = startOfWeekMonday(start)
  const gridEnd = endOfWeekSunday(end)

  const days: HeatmapCell[] = []
  for (let t = gridStart.getTime(); t <= gridEnd.getTime(); t += 86400000) {
    const date = new Date(t)
    const dateStr = dayKeyFromDate(date)
    const value = relatedElementsCountByDay.value.get(dateStr) ?? 0
    days.push({ date, dateStr, value })
  }

  const weeks: HeatmapWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    const chunk = days.slice(i, i + 7)
    const firstOfMonth = chunk.find((d) => d.date.getUTCDate() === 1)
    weeks.push({
      weekStart: chunk[0]?.dateStr ?? `week-${i}`,
      monthLabel: firstOfMonth
        ? firstOfMonth.date.toLocaleString('en-US', { month: 'short' })
        : '',
      days: chunk
    })
  }
  return weeks
})

const relatedElementsHeatClass = (value: number): string => {
  if (!value || relatedElementsHeatmapMax.value === 0) return 'bg-slate-200 dark:bg-zinc-800'
  const ratio = value / relatedElementsHeatmapMax.value
  if (ratio <= 0.25) return 'bg-emerald-700/60 border-emerald-700'
  if (ratio <= 0.5) return 'bg-emerald-600/70 border-emerald-600'
  if (ratio <= 0.75) return 'bg-emerald-600/90 border-emerald-600'
  return 'bg-emerald-600 border-emerald-400'
}

onMounted(async () => {
  try {
    loading.value = true
    landmark.value = await getLandmark(props.id)
  } catch (error) {
    console.error('Error loading landmark:', error)
  } finally {
    loading.value = false
  }
})
</script>
