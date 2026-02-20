<template>
  <div class="p-4 md:px-8">
    <div v-if="loading" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else-if="llmCall">
      <div class="mb-6">
        <button
          type="button"
          @click="goBack"
          class="text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ← Back
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-6">
        <h1 class="text-3xl font-bold">LLM Call Details</h1>
        <button
          type="button"
          @click="copyRawJson"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <span v-if="copyFeedback">{{ copyFeedback }}</span>
          <span v-else>Copy raw JSON</span>
        </button>
        <button
          type="button"
          @click="copySummaryText"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <span v-if="copySummaryFeedback">{{ copySummaryFeedback }}</span>
          <span v-else>Copy summary</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Model</div>
          <div class="text-lg">{{ llmCall.model }}</div>
        </div>

        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</div>
          <div :class="['text-lg', getStatusClass(llmCall.status)]">
            {{ llmCall.status }}
          </div>
        </div>

        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Created At</div>
          <div class="text-lg">{{ formatDate(llmCall.created_at) }}</div>
        </div>

        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Updated At</div>
          <div class="text-lg">{{ formatDate(llmCall.updated_at) }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Input Tokens</div>
          <div class="text-xl">{{ llmCall.input_tokens_used?.toLocaleString() || 'N/A' }}</div>
        </div>

        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Output Tokens</div>
          <div class="text-xl">{{ llmCall.output_tokens_used?.toLocaleString() || 'N/A' }}</div>
        </div>

        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Reasoning Tokens</div>
          <div class="text-xl">{{ llmCall.reasoning_tokens_used?.toLocaleString() || 'N/A' }}</div>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.price">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Cost</div>
          <div class="text-2xl">{{ llmCall.price.toFixed(6) }} {{ llmCall.currency }}</div>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.request_url">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Request URL</div>
          <div class="text-sm break-all">{{ llmCall.request_url }}</div>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.user_prompt">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">User Prompt</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ llmCall.user_prompt }}</pre>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.output">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Output</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ formatJson(llmCall.output) }}</pre>
        </div>
      </div>

      <div class="mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Prompt</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ llmCall.prompt }}</pre>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.schema">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Schema</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ llmCall.schema }}</pre>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.request">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Request</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ formatJson(llmCall.request) }}</pre>
        </div>
      </div>

      <div class="mb-6" v-if="llmCall.response">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Response</div>
          <pre class="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded overflow-x-auto">{{ formatJson(llmCall.response) }}</pre>
        </div>
      </div>

    </div>
    <div v-else class="text-center text-2xl pt-10 text-red-600">LLM Call not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLlmCall } from '@/composables/useLlmCall'
import { type LlmCall } from '@/types/models'

const router = useRouter()
const { getLlmCall } = useLlmCall()

const props = defineProps<{
  id: string
}>()

const llmCall = ref<LlmCall | null>(null)
const loading = ref(true)
const copyFeedback = ref('')
const copySummaryFeedback = ref('')

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/app/llm-calls')
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

const formatJson = (jsonString: string): string => {
  if (!jsonString) return ''
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonString
  }
}

const copyRawJson = async () => {
  if (!llmCall.value) return
  try {
    const raw = JSON.stringify(llmCall.value, null, 2)
    await navigator.clipboard.writeText(raw)
    copyFeedback.value = 'Copied!'
    setTimeout(() => { copyFeedback.value = '' }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    copyFeedback.value = 'Copy failed'
    setTimeout(() => { copyFeedback.value = '' }, 2000)
  }
}

const summaryText = (): string => {
  if (!llmCall.value) return ''
  const call = llmCall.value as any
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
  if (!llmCall.value) return
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

onMounted(async () => {
  try {
    loading.value = true
    llmCall.value = await getLlmCall(props.id)
  } catch (error) {
    console.error('Error loading LLM call:', error)
  } finally {
    loading.value = false
  }
})
</script>
