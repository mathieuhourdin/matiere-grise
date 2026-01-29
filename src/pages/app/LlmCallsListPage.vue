<template>
  <div class="p-4">
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold">LLM Calls</h1>
      <div class="flex flex-wrap items-center gap-3 ml-auto">
        <div class="flex items-center gap-2">
          <label for="datetime-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            From:
          </label>
          <input
            id="datetime-filter"
            v-model="filterDateTime"
            type="datetime-local"
            class="px-3 py-1.5 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          type="button"
          @click="copyFilteredData"
          :disabled="!filterDateTime || getFilteredCallsForCopy().length === 0"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="copyFeedback">{{ copyFeedback }}</span>
          <span v-else>Copy filtered data</span>
        </button>
      </div>
    </div>
    <div v-if="loading" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else class="space-y-4">
      <a
        v-for="llmCall in llmCalls"
        :key="llmCall.id"
        :href="`/app/llm-calls/${llmCall.id}`"
        class="block border border-slate-300 dark:border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 no-underline"
        @click="handleClick($event, llmCall.id)"
        @auxclick="handleAuxClick($event)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="font-semibold text-lg">{{ llmCall.model }}</div>
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
        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {{ truncateText(llmCall.prompt, 150) }}
        </div>
      </a>
      <div v-if="llmCalls.length === 0" class="text-center text-gray-500 py-8">
        No LLM calls found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLlmCall } from '@/composables/useLlmCall'
import { type LlmCall } from '@/types/models'

const router = useRouter()
const { getLlmCalls } = useLlmCall()

const llmCalls = ref<LlmCall[]>([])
const loading = ref(true)
const filterDateTime = ref('')
const copyFeedback = ref('')

const getFilteredCallsForCopy = (): LlmCall[] => {
  if (!filterDateTime.value) return []
  const filterDate = new Date(filterDateTime.value)
  return llmCalls.value.filter(call => {
    const callDate = new Date(call.created_at)
    return callDate >= filterDate
  })
}

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

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const setMostRecentDate = () => {
  if (llmCalls.value.length === 0) return
  
  const mostRecent = llmCalls.value.reduce((latest, current) => {
    const latestDate = new Date(latest.created_at)
    const currentDate = new Date(current.created_at)
    return currentDate > latestDate ? current : latest
  })
  
  filterDateTime.value = formatDateForInput(mostRecent.created_at)
}

const copyFilteredData = async () => {
  const filteredCalls = getFilteredCallsForCopy()
  if (!filterDateTime.value || filteredCalls.length === 0) return
  
  try {
    const filteredData = filteredCalls.map(call => ({
      id: call.id,
      model: call.model,
      created_at: call.created_at,
      prompt: call.prompt,
      schema: call.schema,
      output: call.output
    }))
    const dataToCopy = JSON.stringify(filteredData, null, 2)
    await navigator.clipboard.writeText(dataToCopy)
    copyFeedback.value = `Copied ${filteredCalls.length} call(s)!`
    setTimeout(() => { copyFeedback.value = '' }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    copyFeedback.value = 'Copy failed'
    setTimeout(() => { copyFeedback.value = '' }, 2000)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    llmCalls.value = await getLlmCalls()
    setMostRecentDate()
  } catch (error) {
    console.error('Error loading LLM calls:', error)
  } finally {
    loading.value = false
  }
})
</script>

