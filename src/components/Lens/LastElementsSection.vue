<template>
  <section class="font-inter">
    <div v-if="!displayLandscapeAnalysis" class="text-sm text-slate-500 mt-3">
      Aucune analyse courante
    </div>
    <div v-else-if="isLoadingElements" class="text-sm text-slate-500 mt-3">
      Chargement...
    </div>
    <div v-else-if="visibleElements.length === 0" class="text-sm text-slate-500 mt-3">
      Aucun élément
    </div>
    <div v-else class="mt-3">
      <ul class="list-disc list-outside pl-4 space-y-1">
        <li
          v-for="(element, index) in visibleElements"
          :key="element.id ?? `element-${index}`"
          class="text-slate-300 marker:text-slate-500"
        >
          <div class="text-xs leading-[0.95rem] text-slate-200 whitespace-normal break-words">
            {{ elementLineText(element) }}
          </div>
        </li>
      </ul>
      <div class="mt-2 flex justify-end">
        <router-link
          v-if="displayLandscapeAnalysis?.id"
          :to="{ name: 'analysis', query: { id: displayLandscapeAnalysis.id } }"
          class="text-xs text-slate-400 underline hover:text-slate-200 transition-colors"
        >
          voir plus
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useLens } from '@/composables/useLens'

const { displayLandscapeAnalysis } = useLens()
const elements = ref<any[]>([])
const isLoadingElements = ref(false)

const decodeJsonEncodedContent = (content: unknown): any | null => {
  if (typeof content !== 'string') return null
  let current: any = content.trim()
  if (!current) return null

  for (let depth = 0; depth < 3; depth++) {
    if (typeof current !== 'string') return current
    const trimmed = current.trim()
    if (!trimmed) return null
    const startsLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')
    if (!startsLikeJson) return depth === 0 ? null : current
    try {
      current = JSON.parse(trimmed)
    } catch (_error) {
      return depth === 0 ? null : current
    }
  }
  return current
}

const decodeElementContent = (element: any): Record<string, any> | null => {
  const decoded = decodeJsonEncodedContent(element?.content ?? element?.resource?.content ?? '')
  if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) {
    return decoded as Record<string, any>
  }
  return null
}

const elementTypeValue = (element: any): string => {
  const decoded = decodeElementContent(element)
  const raw = element?.element_type
    ?? element?.elementType
    ?? element?.resource?.element_type
    ?? element?.resource?.elementType
    ?? decoded?.element_type
    ?? decoded?.elementType
    ?? ''
  return String(raw).trim().toUpperCase()
}

const elementDateValue = (element: any): number => {
  const raw = element?.interaction_date ?? element?.created_at ?? 0
  return new Date(raw).getTime() || 0
}

const transactionElements = computed(() => {
  return elements.value
    .filter((element) => elementTypeValue(element) === 'TRANSACTION')
    .sort((a, b) => elementDateValue(b) - elementDateValue(a))
})

const visibleElements = computed(() => {
  return transactionElements.value.slice(0, 4)
})

const loadAnalysisElements = async (analysisId: string) => {
  if (!analysisId) {
    elements.value = []
    return
  }
  isLoadingElements.value = true
  try {
    const response = await fetchWrapper.get(`/analysis/${analysisId}/elements`)
    elements.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(`Error loading analysis elements for analysis ${analysisId}:`, error)
    elements.value = []
  } finally {
    isLoadingElements.value = false
  }
}

watch(
  () => displayLandscapeAnalysis.value?.id,
  async () => {
    const analysisId = displayLandscapeAnalysis.value?.id
    if (!analysisId) {
      elements.value = []
      return
    }
    await loadAnalysisElements(analysisId)
  },
  { immediate: true }
)

const elementTargetText = (element: any): string => {
  const decoded = decodeElementContent(element)
  const target = decoded?.target ?? element?.target
  if (typeof target === 'string' && target.trim().length > 0) return target.trim()
  if (target != null) return String(target).trim() || 'Sans cible'
  return 'Sans cible'
}

const elementStatusText = (element: any): string => {
  const decoded = decodeElementContent(element)
  const status = decoded?.status ?? element?.status
  if (typeof status === 'string' && status.trim().length > 0) return status.trim()
  if (status != null) return String(status).trim() || 'Sans statut'
  return 'Sans statut'
}

const elementVerbText = (element: any): string => {
  const decoded = decodeElementContent(element)
  const verb = decoded?.verb ?? element?.verb
  if (typeof verb === 'string' && verb.trim().length > 0) return verb.trim()
  if (verb != null) return String(verb).trim() || 'Sans verbe'
  return 'Sans verbe'
}

const elementLineText = (element: any): string => {
  return `${elementStatusText(element)} - ${elementVerbText(element)} - ${elementTargetText(element)}`
}

</script>
