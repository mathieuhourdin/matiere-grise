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
      <LlmCallCard
        v-for="llmCall in llmCalls"
        :key="llmCall.id"
        :llm-call="llmCall"
      />
      <div v-if="llmCalls.length === 0" class="text-center text-gray-500 py-8">
        No LLM calls found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLlmCall } from '@/composables/useLlmCall'
import { type LlmCall } from '@/types/models'
import LlmCallCard from '@/components/LlmCall/LlmCallCard.vue'

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
