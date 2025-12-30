<template>
  <div
    :class="[
      'flex-shrink-0 rounded-2xl border border-slate-800 dark:border-gray-700 bg-slate-900/60 dark:bg-elevated backdrop-blur-sm transition-colors duration-200 overflow-hidden',
      paddingClass,
      widthClass,
      heightClass
    ]"
  >
    <!-- Header with title and optional action -->
    <div v-if="$slots.header || showAction" class="flex items-center mb-2">
      <slot name="header" />
      <div v-if="showAction" class="ml-auto">
        <slot name="action">
          <button
            v-if="actionIconComponent"
            @click="$emit('action')"
            class="hover:opacity-70 transition-opacity"
          >
            <component :is="actionIconComponent" class="w-8 h-8" />
          </button>
        </slot>
      </div>
    </div>

    <!-- Content -->
    <div :class="contentClass">
      <!-- Auto-render list if items are provided -->
      <ul v-if="items && items.length > 0" :class="listClass">
        <li 
          v-for="(item, index) in items" 
          :key="item.id || item.title || index" 
          :class="[itemClass, computedLineHeightClass]"
          :title="item.content"
        >
          <span class="text-xs md:text-sm">{{ item.title }}</span>
          <span v-if="showDate && item.date" class="text-2xs ml-1 text-slate-500 dark:text-gray-400">
            {{ formatDate(item.date) }}
          </span>
        </li>
      </ul>
      <!-- Custom content slot if no items -->
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as HeroIcons from '@heroicons/vue/24/outline'
import AddIcon from '@/components/Ui/Icons/AddIcon.vue'

interface ListItem {
  id?: string | number
  title: string
  content?: string
  date?: Date | string
}

const props = withDefaults(
  defineProps<{
    actionIcon?: string
    showAction?: boolean
    width?: 'auto' | 'full' | '1/3' | '2/5' | '3/5' | '30%'
    height?: 'auto' | '36' | '40' | '44' | '60'
    padding?: 'sm' | 'md' | 'lg'
    contentClass?: string
    scrollable?: boolean
    items?: ListItem[]
    showDate?: boolean
    itemClass?: string
    listClass?: string
    lineHeight?: 'none' | 'tight' | 'normal' | 'relaxed' | 'loose'
  }>(),
  {
    showAction: false,
    width: 'auto',
    height: 'auto',
    padding: 'md',
    contentClass: '',
    scrollable: true,
    showDate: false,
    itemClass: '',
    listClass: 'list-disc list-inside',
    lineHeight: 'normal'
  }
)

defineEmits<{
  (e: 'action'): void
}>()

const widthClass = computed(() => {
  if (props.width === 'auto') return ''
  if (props.width === 'full') return 'w-full'
  if (props.width === '1/3') return 'md:w-1/3 w-3/5'
  if (props.width === '2/5') return 'md:w-2/5 w-full'
  if (props.width === '3/5') return 'md:w-3/5 w-full'
  if (props.width === '30%') return 'md:w-[30%] w-3/5'
  return ''
})

const heightClass = computed(() => {
  if (props.height === 'auto') return ''
  if (props.height === '36') return 'h-36 md:h-40'
  if (props.height === '40') return 'h-40 md:h-40'
  if (props.height === '44') return 'h-44 md:h-60'
  if (props.height === '60') return 'h-60 md:h-60'
  return ''
})

const paddingClass = computed(() => {
  if (props.padding === 'sm') return 'p-3'
  if (props.padding === 'md') return 'pt-4 p-3 md:p-4'
  if (props.padding === 'lg') return 'p-4 md:p-6'
  return ''
})

const actionIconComponent = computed(() => {
  if (!props.actionIcon) return null
  if (props.actionIcon === 'AddIcon') return AddIcon
  return HeroIcons[props.actionIcon as keyof typeof HeroIcons] || null
})

const computedLineHeightClass = computed(() => {
  // If itemClass is provided with leading-*, respect it (user override)
  if (props.itemClass && props.itemClass.includes('leading-')) {
    return ''
  }
  
  // Auto-adjust based on context
  if (props.showDate) {
    // Items with dates need more space
    return 'leading-4 md:leading-5'
  }
  
  // Use the specified lineHeight prop
  switch (props.lineHeight) {
    case 'none':
      return 'leading-none'
    case 'tight':
      return 'leading-tight'
    case 'normal':
      return 'leading-normal'
    case 'relaxed':
      return 'leading-relaxed'
    case 'loose':
      return 'leading-loose'
    default:
      return 'leading-normal'
  }
})

const formatDate = (date: Date | string): string => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString()
}
</script>
