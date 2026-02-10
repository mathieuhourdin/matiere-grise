<template>
  <div v-if="compact" class="text-left">
    <div v-if="title" class="text-xs leading-4 text-slate-300">{{ title }}</div>
    <div v-if="loading" class="text-[10px] text-slate-500">...</div>
    <div v-else-if="compactWeeks.length === 0" class="mt-1 text-[10px] text-slate-500">
      {{ emptyText }}
    </div>
    <div v-else :class="['mt-1 flex flex-col', isMobile ? 'gap-[1px]' : 'gap-[2px]']">
      <div
        :class="[
          'flex leading-none text-slate-500',
          isMobile ? 'gap-[1px] h-[10px] text-[8px]' : 'gap-[2px] h-3 text-[9px]'
        ]"
      >
        <div
          v-for="(week, wIdx) in compactWeeks"
          :key="`compact-month-${wIdx}-${week.weekStart}`"
          :class="[
            'overflow-hidden text-ellipsis whitespace-nowrap',
            isMobile ? 'w-[12px]' : 'w-[17px]'
          ]"
        >
          {{ compactMonthLabel(week.monthLabel, wIdx) }}
        </div>
      </div>
      <div :class="['flex', isMobile ? 'gap-[1px]' : 'gap-[2px]']">
        <div
          v-for="(week, wIdx) in compactWeeks"
          :key="`compact-week-${wIdx}-${week.weekStart}`"
          :class="['grid grid-rows-7', isMobile ? 'gap-[1px]' : 'gap-[2px]']"
        >
          <div
            v-for="day in week.days"
            :key="`compact-day-${day.dateStr}`"
            :class="[
              isMobile ? 'w-[12px] h-[12px] rounded-[3px]' : 'w-[17px] h-[17px] rounded-[4px]',
              'border border-slate-700',
              dayClass(day.value)
            ]"
            :title="`${day.dateStr}: ${day.value}`"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div v-if="title || (showMax && maxValue > 0)" class="flex items-center justify-between mb-3">
      <h2 v-if="title" class="text-lg font-semibold text-slate-700 dark:text-slate-200">
        {{ title }}
      </h2>
      <div v-if="showMax && maxValue > 0" class="text-xs text-slate-500">
        Max: {{ maxValue }}
      </div>
    </div>

    <div v-if="loading" class="text-sm text-slate-500">Chargement...</div>
    <div v-else-if="weeks.length === 0" class="text-sm text-slate-500">
      {{ emptyText }}
    </div>
    <div v-else>
      <div :class="['flex overflow-x-auto', isMobile ? 'gap-1' : 'gap-2']">
        <div
          :class="[
            'grid grid-rows-7 pr-2 text-slate-500',
            isMobile ? 'gap-[2px] pt-4 text-[9px]' : 'gap-1 pt-5 text-[10px]'
          ]"
        >
          <div
            v-for="label in resolvedWeekdayLabels"
            :key="label"
            :class="[
              'flex items-center justify-end leading-none',
              isMobile ? 'h-3' : 'h-4'
            ]"
          >
            {{ label }}
          </div>
        </div>
        <div :class="['flex flex-col', isMobile ? 'gap-1' : 'gap-2']">
          <div :class="['flex text-xs text-slate-500', isMobile ? 'gap-[2px] h-3 text-[10px]' : 'gap-1 h-4']">
            <div
              v-for="(week, wIdx) in weeks"
              :key="`month-${wIdx}-${week.weekStart}`"
              :class="isMobile ? 'w-3' : 'w-4'"
            >
              {{ week.monthLabel }}
            </div>
          </div>
          <div :class="['flex', isMobile ? 'gap-[2px]' : 'gap-1']">
            <div
              v-for="(week, wIdx) in weeks"
              :key="`week-${wIdx}-${week.weekStart}`"
              :class="['grid grid-rows-7', isMobile ? 'gap-[2px]' : 'gap-1']"
            >
              <div
                v-for="day in week.days"
                :key="`day-${day.dateStr}`"
                :class="[
                  isMobile ? 'w-3 h-3' : 'w-4 h-4',
                  'rounded-sm border border-slate-300 dark:border-slate-700',
                  dayClass(day.value)
                ]"
                :title="`${day.dateStr}: ${day.value}`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showLegend" class="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span>{{ legendLessLabel }}</span>
        <div class="flex items-center gap-1">
          <span class="w-3 h-3 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800/50"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-900 bg-emerald-900/50"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-800 bg-emerald-800/70"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-700 bg-emerald-700/90"></span>
          <span class="w-3 h-3 rounded-sm border border-emerald-600 bg-emerald-600"></span>
        </div>
        <span>{{ legendMoreLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'

const { isMobile } = useMenu()
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

const props = withDefaults(defineProps<{
  days: HeatmapDay[]
  compact?: boolean
  loading?: boolean
  title?: string
  emptyText?: string
  monthLocale?: string
  weekdayLabels?: string[]
  legendLessLabel?: string
  legendMoreLabel?: string
  showLegend?: boolean
  showMax?: boolean
  rangeStart?: string | Date | null
  rangeEnd?: string | Date | null
  hideFirstCompactMonthLabel?: boolean
  compactWeeksLimit?: number | null
}>(), {
  compact: false,
  loading: false,
  title: '',
  emptyText: 'No data',
  monthLocale: 'fr-FR',
  legendLessLabel: 'Moins',
  legendMoreLabel: 'Plus',
  showLegend: true,
  showMax: true,
  rangeStart: null,
  rangeEnd: null,
  hideFirstCompactMonthLabel: false,
  compactWeeksLimit: null
})

const resolvedWeekdayLabels = computed(() => {
  if (props.weekdayLabels && props.weekdayLabels.length === 7) return props.weekdayLabels
  return ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
})

const parseDayKey = (dayKey: string): Date => {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const dayKeyFromDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toDayKey = (raw: string | Date): string | null => {
  if (!raw) return null
  if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return dayKeyFromDate(date)
}

const parseBoundary = (raw: string | Date | null | undefined): Date | null => {
  if (!raw) return null
  if (raw instanceof Date) {
    if (Number.isNaN(raw.getTime())) return null
    return new Date(Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate()))
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return parseDayKey(raw)
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
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

const valueByDate = computed(() => {
  const map = new Map<string, number>()
  for (const item of props.days ?? []) {
    const dayKey = toDayKey(item.day)
    if (!dayKey) continue
    const value = Number(item.value ?? 0)
    map.set(dayKey, (map.get(dayKey) ?? 0) + (Number.isNaN(value) ? 0 : value))
  }
  return map
})

const maxValue = computed(() => {
  const values = Array.from(valueByDate.value.values())
  if (values.length === 0) return 0
  return Math.max(...values)
})

const bounds = computed(() => {
  const start = parseBoundary(props.rangeStart)
  const end = parseBoundary(props.rangeEnd)
  if (start && end && start.getTime() <= end.getTime()) {
    return { start, end }
  }
  if (valueByDate.value.size === 0) return null
  const dayKeys = Array.from(valueByDate.value.keys()).sort()
  return {
    start: parseDayKey(dayKeys[0]),
    end: parseDayKey(dayKeys[dayKeys.length - 1])
  }
})

const weeks = computed<HeatmapWeek[]>(() => {
  if (!bounds.value) return []
  const gridStart = startOfWeekMonday(bounds.value.start)
  const gridEnd = endOfWeekSunday(bounds.value.end)

  const days: HeatmapCell[] = []
  for (let t = gridStart.getTime(); t <= gridEnd.getTime(); t += 86400000) {
    const date = new Date(t)
    const dateStr = dayKeyFromDate(date)
    const value = valueByDate.value.get(dateStr) ?? 0
    days.push({ date, dateStr, value })
  }

  const result: HeatmapWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    const chunk = days.slice(i, i + 7)
    const firstOfMonth = chunk.find((d) => d.date.getUTCDate() === 1)
    result.push({
      weekStart: chunk[0]?.dateStr ?? `week-${i}`,
      monthLabel: firstOfMonth ? firstOfMonth.date.toLocaleString(props.monthLocale, { month: 'short' }) : '',
      days: chunk
    })
  }
  return result
})

const compactWeeks = computed<HeatmapWeek[]>(() => {
  const limit = props.compactWeeksLimit
  if (!props.compact || limit == null || !Number.isFinite(limit) || limit <= 0) {
    return weeks.value
  }
  const safeLimit = Math.floor(limit)
  if (weeks.value.length <= safeLimit) return weeks.value
  return weeks.value.slice(weeks.value.length - safeLimit)
})

const compactMonthLabel = (label: string, index: number): string => {
  if (!label) return ''
  if (props.hideFirstCompactMonthLabel && index === 0) return ''
  return label.replace('.', '').slice(0, 3)
}

const dayClass = (value: number): string => {
  if (!value || maxValue.value === 0) {
    return props.compact ? 'bg-slate-800/50' : 'bg-slate-200 dark:bg-slate-800/50'
  }
  const ratio = value / maxValue.value
  if (ratio <= 0.25) return 'bg-emerald-700/60 border-emerald-700'
  if (ratio <= 0.5) return 'bg-emerald-600/70 border-emerald-600'
  if (ratio <= 0.75) return 'bg-emerald-600/90 border-emerald-600'
  return 'bg-emerald-600 border-emerald-400'
}
</script>
