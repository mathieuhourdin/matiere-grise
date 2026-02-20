<template>
  <a
    :href="`/app/llm-calls/${llmCall.id}`"
    class="block border border-slate-300 dark:border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 no-underline"
    @click="handleClick($event, llmCall.id)"
    @auxclick="handleAuxClick($event)"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <div class="font-semibold text-lg">{{ llmCall.display_name || llmCall.model }}</div>
          <button
            type="button"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border border-slate-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
            @click.stop.prevent="copySummaryText"
          >
            <span v-if="copySummaryFeedback">{{ copySummaryFeedback }}</span>
            <span v-else>Copy summary</span>
          </button>
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type LlmCall } from '@/types/models'

const props = withDefaults(defineProps<{
  llmCall: LlmCall
  showPrompt?: boolean
}>(), {
  showPrompt: true
})

const router = useRouter()
const copySummaryFeedback = ref('')

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

const summaryText = (): string => {
  const call = props.llmCall as any
  const displayName = call.display_name ?? call.displayName ?? ''
  const analysisId = call.analysis_id ?? call.analysisId ?? ''
  const systemPrompt = call.prompt ?? ''
  const userPrompt = call.user_prompt ?? call.userPrompt ?? ''
  const output = call.output ?? ''

  return [
    `display_name: ${displayName}`,
    `analysis_id: ${analysisId}`,
    `System prompt: ${systemPrompt}`,
    `User prompt: ${userPrompt}`,
    `Output: ${output}`
  ].join('\n')
}

const copySummaryText = async () => {
  try {
    await navigator.clipboard.writeText(summaryText())
    copySummaryFeedback.value = 'Copied!'
    setTimeout(() => { copySummaryFeedback.value = '' }, 2000)
  } catch (err) {
    console.error('Failed to copy summary:', err)
    copySummaryFeedback.value = 'Copy failed'
    setTimeout(() => { copySummaryFeedback.value = '' }, 2000)
  }
}
</script>
