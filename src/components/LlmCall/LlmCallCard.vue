<template>
  <a
    :href="`/app/llm-calls/${llmCall.id}`"
    class="block border border-slate-300 dark:border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 no-underline"
    @click="handleClick($event, llmCall.id)"
    @auxclick="handleAuxClick($event)"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="font-semibold text-lg">{{ llmCall.display_name || llmCall.model }}</div>
        <div class="text-xs text-gray-500 mt-0.5">{{ llmCall.model }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Status: <span :class="getStatusClass(llmCall.status)">{{ llmCall.status }}</span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Created: {{ formatDate(llmCall.created_at) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1" v-if="llmCall.price">
          Cost: {{ llmCall.price.toFixed(4) }} {{ llmCall.currency }}
        </div>
      </div>
      <div class="text-right text-sm text-gray-500">
        <div v-if="llmCall.input_tokens_used">
          Input: {{ llmCall.input_tokens_used.toLocaleString() }}
        </div>
        <div v-if="llmCall.output_tokens_used">
          Output: {{ llmCall.output_tokens_used.toLocaleString() }}
        </div>
        <div v-if="llmCall.reasoning_tokens_used">
          Reasoning: {{ llmCall.reasoning_tokens_used.toLocaleString() }}
        </div>
      </div>
    </div>
    <div v-if="showPrompt" class="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
      {{ truncateText(llmCall.prompt, 150) }}
    </div>
  </a>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type LlmCall } from '@/types/models'

withDefaults(defineProps<{
  llmCall: LlmCall
  showPrompt?: boolean
}>(), {
  showPrompt: true
})

const router = useRouter()

const handleClick = (event: MouseEvent, id: string) => {
  // Allow default behavior for Ctrl/Cmd + click (opens in new tab)
  if (event.ctrlKey || event.metaKey) {
    return
  }
  
  // Prevent default and use router for normal clicks
  event.preventDefault()
  router.push({ path: '/app/llm-calls/' + id })
}

const handleAuxClick = (event: MouseEvent) => {
  // Allow default behavior for middle click (button === 1) - opens in new tab
  if (event.button === 1) {
    return
  }
  // For other auxiliary clicks, prevent default
  event.preventDefault()
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getStatusClass = (status: string): string => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'success' || statusLower === 'completed') {
    return 'text-green-600 dark:text-green-400'
  }
  if (statusLower === 'error' || statusLower === 'failed') {
    return 'text-red-600 dark:text-red-400'
  }
  if (statusLower === 'pending' || statusLower === 'processing') {
    return 'text-yellow-600 dark:text-yellow-400'
  }
  return 'text-gray-600 dark:text-gray-400'
}
</script>
