<template>
  <div>
    <!-- LLM Calls from GET analysis/:id/llm_calls -->
    <div class="mt-8">
      <h3 class="text-xl font-bold mb-4">Fonctionnement de l'analyse</h3>
      <div class="space-y-4">
        <LlmCallCard
          v-for="llmCall in llmCalls"
          :key="llmCall.id"
          :llm-call="llmCall"
        />
      </div>
      <div v-if="llmCalls.length === 0" class="text-sm text-slate-500">
        Aucun appel LLM
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLlmCall } from '@/composables/useLlmCall'
import { type LlmCall } from '@/types/models'
import LlmCallCard from '@/components/LlmCall/LlmCallCard.vue'
import { fetchWrapper } from '@/helpers'

const { getLlmCalls } = useLlmCall()

const props = defineProps<{
  id: string
}>()
const llmCalls = ref<LlmCall[]>([])
const loadLlmCalls = async () => {
  try {
    const response = await fetchWrapper.get(`/analysis/${props.id}/llm_calls`)
    llmCalls.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching analysis llm_calls:', error)
    llmCalls.value = []
  }
}

onMounted(async () => {
  await loadLlmCalls()
})
</script>