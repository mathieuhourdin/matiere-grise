<template>
  <div>
    <div class="mt-8">
      <div class="mb-2 flex items-center justify-between gap-2">
        <h3 class="text-xl font-bold">Contexte d'extraction grammaticale</h3>
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!grammaticalExtractionContextJson"
          title="Copier le JSON"
          @click="copyGrammaticalContext"
        >
          <ClipboardIcon class="w-4 h-4" />
        </button>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/40 p-3 h-52 overflow-y-auto">
        <div v-if="isLoadingGrammaticalContext" class="text-sm text-slate-500">
          Chargement...
        </div>
        <pre v-else-if="grammaticalExtractionContextJson" class="text-xs leading-5 text-slate-200 whitespace-pre-wrap break-words">{{ grammaticalExtractionContextJson }}</pre>
        <div v-else class="text-sm text-slate-500">
          Aucun contexte disponible
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useLlmCall } from '@/composables/useLlmCall'
import { type LlmCall } from '@/types/models'
import LlmCallCard from '@/components/LlmCall/LlmCallCard.vue'
import { fetchWrapper } from '@/helpers'
import { ClipboardIcon } from '@heroicons/vue/24/outline'
import { useSnackbar } from '@/composables/useSnackbar'

const { getLlmCalls } = useLlmCall()
const { launchSnackbar } = useSnackbar()

const props = defineProps<{
  id: string
}>()
const llmCalls = ref<LlmCall[]>([])
const analysis = ref<any>(null)
const traceMirror = ref<any>(null)
const referencesWithLandmark = ref<any[]>([])
const previousLandscapeLandmarks = ref<any[]>([])
const isLoadingGrammaticalContext = ref(false)

const getTraceMirrorId = (value: any): string | null => {
  const id = value?.trace_mirror_id ?? value?.traceMirrorId
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const getAnalysisId = (value: any): string | null => {
  const id = value?.id
  if (id == null) return null
  const parsed = String(id).trim()
  return parsed.length > 0 ? parsed : null
}

const loadPreviousLandscapeLandmarks = async (analysisId: string) => {
  previousLandscapeLandmarks.value = []
  try {
    const parentsResponse = await fetchWrapper.get(`/analysis/${analysisId}/parents`)
    const parents = Array.isArray(parentsResponse.data) ? parentsResponse.data : []
    const previousParent = parents[0] ?? null
    const previousParentId = getAnalysisId(previousParent)
    if (!previousParentId) return

    const parentLandmarksResponse = await fetchWrapper.get(`/analysis/${previousParentId}/landmarks`)
    previousLandscapeLandmarks.value = Array.isArray(parentLandmarksResponse.data) ? parentLandmarksResponse.data : []
  } catch (error) {
    console.error('Error loading previous landscape landmarks:', error)
    previousLandscapeLandmarks.value = []
  }
}

const loadGrammaticalContext = async () => {
  isLoadingGrammaticalContext.value = true
  analysis.value = null
  traceMirror.value = null
  referencesWithLandmark.value = []
  previousLandscapeLandmarks.value = []

  try {
    const analysisResponse = await fetchWrapper.get(`/analysis/${props.id}`)
    analysis.value = analysisResponse.data?.analysis ?? analysisResponse.data ?? null
    const analysisId = getAnalysisId(analysis.value) ?? props.id
    const previousLandscapeLandmarksPromise = loadPreviousLandscapeLandmarks(analysisId)
    const traceMirrorId = getTraceMirrorId(analysis.value)
    if (!traceMirrorId) {
      await previousLandscapeLandmarksPromise
      return
    }

    const [traceMirrorResponse, referencesResponse] = await Promise.all([
      fetchWrapper.get(`/trace_mirrors/${traceMirrorId}`),
      fetchWrapper.get(`/trace_mirrors/${traceMirrorId}/references`)
    ])

    traceMirror.value = traceMirrorResponse.data ?? null
    const references = Array.isArray(referencesResponse.data) ? referencesResponse.data : []

    const landmarkIds = Array.from(
      new Set(
        references
          .map((reference: any) => reference?.landmark_id ?? reference?.landmarkId)
          .filter((value: any) => value != null && String(value).trim().length > 0)
          .map((value: any) => String(value).trim())
      )
    )

    const landmarkResults = await Promise.all(
      landmarkIds.map(async (landmarkId) => {
        try {
          const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
          return [landmarkId, response.data ?? null] as const
        } catch (error) {
          console.error(`Error fetching landmark ${landmarkId}:`, error)
          return [landmarkId, null] as const
        }
      })
    )

    const landmarkById = landmarkResults.reduce<Record<string, any>>((acc, [landmarkId, landmark]) => {
      acc[landmarkId] = landmark
      return acc
    }, {})

    referencesWithLandmark.value = references.map((reference: any) => {
      const landmarkId = reference?.landmark_id ?? reference?.landmarkId
      const normalizedLandmarkId = landmarkId != null ? String(landmarkId).trim() : ''
      return {
        ...reference,
        landmark: normalizedLandmarkId ? (landmarkById[normalizedLandmarkId] ?? null) : null
      }
    })

    await previousLandscapeLandmarksPromise
  } catch (error) {
    console.error('Error loading grammatical extraction context:', error)
    analysis.value = null
    traceMirror.value = null
    referencesWithLandmark.value = []
    previousLandscapeLandmarks.value = []
  } finally {
    isLoadingGrammaticalContext.value = false
  }
}

const grammaticalExtractionContext = computed(() => {
  if (!traceMirror.value) return null
  return {
    tagged_text: traceMirror.value?.content ?? traceMirror.value?.title ?? '',
    references: referencesWithLandmark.value,
    previous_landscape_landmarks: previousLandscapeLandmarks.value
  }
})

const grammaticalExtractionContextJson = computed(() => {
  if (!grammaticalExtractionContext.value) return ''
  return JSON.stringify(grammaticalExtractionContext.value, null, 2)
})

const copyGrammaticalContext = async () => {
  if (!grammaticalExtractionContextJson.value) return
  try {
    await navigator.clipboard.writeText(grammaticalExtractionContextJson.value)
    launchSnackbar('Contexte copié dans le presse-papiers', 'success')
  } catch (error) {
    console.error('Failed to copy grammatical extraction context:', error)
    launchSnackbar('Échec de la copie', 'error')
  }
}

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
  await Promise.all([
    loadLlmCalls(),
    loadGrammaticalContext()
  ])
})

watch(
  () => props.id,
  async () => {
    await Promise.all([
      loadLlmCalls(),
      loadGrammaticalContext()
    ])
  }
)
</script>
