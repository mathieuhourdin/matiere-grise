<template>
  <div v-if="compact" class="flex items-center">
    <button
      type="button"
      class="rounded-lg border border-slate-700 bg-slate-900/60 p-2 hover:border-slate-500 transition-colors"
      :title="'Voir la heatmap'"
      @click="openModal"
    >
      <div class="text-xs text-slate-300">Activité par jour</div>
      <div v-if="loading" class="text-[10px] text-slate-500">...</div>
      <div v-else class="flex gap-[2px]">
        <div
          v-for="(week, wIdx) in compactWeeks"
          :key="`compact-week-${wIdx}-${week.weekStart}`"
          class="grid grid-rows-7 gap-[2px]"
        >
          <div
            v-for="day in week.days"
            :key="`compact-day-${day.dateStr}`"
            class="w-[15px] h-[15px] rounded-[4px] border border-slate-700"
            :class="getDayClass(day.value)"
          ></div>
        </div>
      </div>
    </button>

    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[120] flex items-center justify-center p-4"
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

            <div v-if="loading" class="text-slate-500 text-sm">Chargement...</div>
            <div v-else>
              <div class="flex gap-2 overflow-x-auto">
                <div class="grid grid-rows-7 gap-1 pr-2 pt-5 text-[10px] text-slate-500">
                  <div v-for="label in weekdayLabels" :key="label" class="h-3 flex items-center justify-end leading-none">
                    {{ label }}
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2 h-4 text-xs text-slate-500">
                    <div
                      v-for="(week, wIdx) in weeks"
                      :key="`modal-month-${wIdx}-${week.weekStart}`"
                      class="w-4"
                    >
                      {{ week.monthLabel }}
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div
                      v-for="(week, wIdx) in weeks"
                      :key="`modal-week-${wIdx}-${week.weekStart}`"
                      class="grid grid-rows-7 gap-1"
                    >
                      <div
                        v-for="day in week.days"
                        :key="`modal-day-${day.dateStr}`"
                        class="w-4 h-4 rounded-sm border border-slate-700"
                        :class="getDayClass(day.value)"
                        :title="`${day.dateStr}: ${day.value}`"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span>Moins</span>
                <div class="flex items-center gap-1">
                  <span class="w-3 h-3 rounded-sm border border-slate-700 bg-slate-800/50"></span>
                  <span class="w-3 h-3 rounded-sm border border-emerald-900 bg-emerald-900/50"></span>
                  <span class="w-3 h-3 rounded-sm border border-emerald-800 bg-emerald-800/70"></span>
                  <span class="w-3 h-3 rounded-sm border border-emerald-700 bg-emerald-700/90"></span>
                  <span class="w-3 h-3 rounded-sm border border-emerald-600 bg-emerald-600"></span>
                </div>
                <span>Plus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold text-slate-200">Activité</h2>
      <div class="text-xs text-slate-500" v-if="maxValue > 0">
        Max: {{ maxValue }}
      </div>
    </div>

    <div v-if="loading" class="text-slate-500 text-sm">Chargement...</div>
    <div v-else>
      <div class="flex gap-2 overflow-x-auto">
        <div class="grid grid-rows-7 gap-1 pr-2 pt-5 text-[10px] text-slate-500">
          <div v-for="label in weekdayLabels" :key="label" class="h-3 flex items-center justify-end leading-none">
            {{ label }}
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 h-3 text-xs text-slate-500">
            <div
              v-for="(week, wIdx) in weeks"
              :key="`month-${wIdx}-${week.weekStart}`"
              class="w-3"
            >
              {{ week.monthLabel }}
            </div>
          </div>
          <div class="flex gap-2">
            <div
              v-for="(week, wIdx) in weeks"
              :key="`week-${wIdx}-${week.weekStart}`"
              class="grid grid-rows-7 gap-1"
            >
              <div
                v-for="day in week.days"
                :key="day.dateStr"
                class="w-3 h-3 rounded-sm border border-slate-700"
                :class="getDayClass(day.value)"
                :title="`${day.dateStr}: ${day.value}`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span>Moins</span>
        <div class="flex items-center gap-1">
          <span class="w-3 h-3 rounded-sm border border-slate-700 bg-slate-800/50"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-900 bg-emerald-900/50"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-800 bg-emerald-800/70"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-700 bg-emerald-700/90"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-600 bg-emerald-600"></span>
        </div>
        <span>Plus</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'

type HeatmapDay = {
  day: string
  value: number
}

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

const { user } = useUser()
const { launchSnackbar } = useSnackbar()
const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false
})

const loading = ref(false)
const heatmap = ref<HeatmapDay[]>([])
const isModalOpen = ref(false)

const parseDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10)
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

const maxValue = computed(() => {
  if (heatmap.value.length === 0) return 0
  return Math.max(...heatmap.value.map((h) => h.value || 0))
})

const valueByDate = computed(() => {
  const map = new Map<string, number>()
  for (const item of heatmap.value) {
    map.set(item.day, item.value ?? 0)
  }
  return map
})

const weeks = computed<HeatmapWeek[]>(() => {
  if (heatmap.value.length === 0) return []
  const dates = heatmap.value.map((h) => parseDate(h.day))
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
  const start = startOfWeekMonday(minDate)
  const end = endOfWeekSunday(maxDate)

  const days: HeatmapCell[] = []
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const date = new Date(t)
    const dateStr = formatDate(date)
    const value = valueByDate.value.get(dateStr) ?? 0
    days.push({ date, dateStr, value })
  }

  const result: HeatmapWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    const chunk = days.slice(i, i + 7)
    const firstOfMonth = chunk.find((d) => d.date.getUTCDate() === 1)
    result.push({
      weekStart: chunk[0]?.dateStr ?? `week-${i}`,
      monthLabel: firstOfMonth ? firstOfMonth.date.toLocaleString('fr-FR', { month: 'short' }) : '',
      days: chunk
    })
  }
  return result
})

const compactWeeks = computed(() => {
  if (weeks.value.length <= 25) return weeks.value
  return weeks.value.slice(weeks.value.length - 25)
})

const weekdayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const openModal = () => {
  if (!props.compact) return
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const getDayClass = (value: number): string => {
  if (!value || maxValue.value === 0) return 'bg-slate-800/50'
  const ratio = value / maxValue.value
  if (ratio <= 0.25) return 'bg-emerald-700/60 border-emerald-700'
  if (ratio <= 0.5) return 'bg-emerald-600/70 border-emerald-600'
  if (ratio <= 0.75) return 'bg-emerald-600/90 border-emerald-600'
  return 'bg-emerald-600 border-emerald-400'
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
