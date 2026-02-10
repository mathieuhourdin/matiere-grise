import { ref, watch, nextTick } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar'
import { useUser } from '@/composables/useUser'

const { launchSnackbar } = useSnackbar()
const { user } = useUser()

// Types
export interface Lens {
  id: string
  title?: string
  current_landscape_id: string | null
  created_at?: string | Date
  updated_at?: string | Date
  [key: string]: any
}

export interface LandscapeAnalysis {
  id: string
  context?: any
  [key: string]: any
}

export interface Landmark {
  id: string
  title?: string
  content?: string
  landmark_type?: string
  [key: string]: any
}

// State
const lenses = ref<Lens[]>([])
const currentLens = ref<Lens | null>(null)
const headLandscapeAnalysisId = ref<string | null>(null)
const headLandscapeAnalysis = ref<LandscapeAnalysis | null>(null)
const displayLandscapeAnalysisId = ref<string | null>(null)
const displayLandscapeAnalysis = ref<LandscapeAnalysis | null>(null)
const displayLandmarks = ref<Landmark[]>([])
const headLandscapeAnalysisParents = ref<LandscapeAnalysis[]>([])
const isLoadingLenses = ref(false)
const isLoadingAnalysis = ref(false)
const isLoadingLandmarks = ref(false)
const isLoadingParents = ref(false)

type LoadUserLensesOptions = {
  setLoading?: boolean
  autoSelect?: boolean
}

// Fetch all lenses for the current user
async function loadUserLenses(options: LoadUserLensesOptions = {}) {
  const { setLoading = true, autoSelect = true } = options
  console.log('[useLens] loadUserLenses called, user:', user.value)
  if (!user.value?.id) {
    console.warn('[useLens] User not found, skipping loadUserLenses')
    return []
  }
  
  if (setLoading) {
    isLoadingLenses.value = true
  }
  try {
    console.log('[useLens] Fetching lenses for user:', user.value.id)
    const response = await fetchWrapper.get(`/users/${user.value.id}/lens`)
    lenses.value = response.data
    console.log('[useLens] Lenses loaded:', lenses.value)
    
    // Auto-select the most recently updated lens
    if (autoSelect && lenses.value.length > 0) {
      const sortedByUpdatedAt = [...lenses.value].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime()
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime()
        return dateB - dateA // Descending order (most recent first)
      })
      console.log('[useLens] Auto-selecting most recently updated lens:', sortedByUpdatedAt[0])
      selectLens(sortedByUpdatedAt[0])
    }
    return lenses.value
  } catch (error) {
    console.error('Error loading lenses:', error)
    launchSnackbar(`Error loading lenses: ${error}`, 'error')
    return []
  } finally {
    if (setLoading) {
      isLoadingLenses.value = false
    }
  }
}

// Fetch a specific landmark analysis by ID
async function fetchLandscapeAnalysis(analysisId: string, target: 'head' | 'display' = 'head') {
  isLoadingAnalysis.value = true
  try {
    const response = await fetchWrapper.get(`/analysis/${analysisId}`)
    if (target === 'head') {
      headLandscapeAnalysis.value = response.data
    } else {
      displayLandscapeAnalysis.value = response.data
    }
    return response.data
  } catch (error) {
    console.error('Error fetching landmark analysis:', error)
    launchSnackbar(`Error fetching landmark analysis: ${error}`, 'error')
    if (target === 'head') {
      headLandscapeAnalysis.value = null
    } else {
      displayLandscapeAnalysis.value = null
    }
  } finally {
    isLoadingAnalysis.value = false
  }
}

// Select a lens
function selectLens(lens: Lens | null) {
  currentLens.value = lens
}

// Update display landscape analysis (used when clicking on a trace to navigate to parent)
function updateDisplayLandscapeAnalysis(analysisId: string) {
  // Just update the ID - the watch will handle fetching the new analysis
  displayLandscapeAnalysisId.value = analysisId
  console.log('[useLens] Updated display landscape analysis ID to:', analysisId)
}

// Update lens current trace on the API (PUT /lens/id with target_trace_id)
async function updateLensCurrentTrace(traceId: string) {
  if (!currentLens.value?.id) {
    console.warn('[useLens] No current lens, cannot update current trace')
    return
  }
  try {
    await fetchWrapper.put(`/lens/${currentLens.value.id}`, {
      target_trace_id: traceId
    })
    console.log('[useLens] Updated lens current trace to:', traceId)
    await pollLensUntilFinished(currentLens.value.id)
  } catch (error) {
    console.error('Error updating lens current trace:', error)
    launchSnackbar(`Error updating lens: ${error}`, 'error')
  }
}

// Update lens processing_state on the API (PUT /lens/id with full lens + processing_state)
async function updateLensProcessingState(processingState: string) {
  const lens = currentLens.value
  if (!lens?.id) {
    console.warn('[useLens] No current lens, cannot update processing state')
    return
  }
  try {
    const payload = { ...lens, processing_state: processingState }
    await fetchWrapper.put(`/lens/${lens.id}`, payload)
    console.log('[useLens] Updated lens processing_state to:', processingState)
    await pollLensUntilFinished(lens.id)
  } catch (error) {
    console.error('Error updating lens processing state:', error)
    launchSnackbar(`Error updating lens: ${error}`, 'error')
  }
}

// Create a new lens with target_trace_id (POST when user has no lens)
async function createLens(traceId: string) {
  if (!user.value?.id) {
    console.warn('[useLens] User not found, cannot create lens')
    return
  }
  try {
    const response = await fetchWrapper.post(`/lens`, {
      target_trace_id: traceId
    })
    const newLens = response.data as Lens
    lenses.value = [...lenses.value, newLens]
    selectLens(newLens)
    console.log('[useLens] Created lens for trace:', traceId)
  } catch (error) {
    console.error('Error creating lens:', error)
    launchSnackbar(`Error creating lens: ${error}`, 'error')
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const refreshCurrentLens = async (lensId?: string) => {
  const targetId = lensId ?? currentLens.value?.id
  if (!targetId) return null
  const list = await loadUserLenses({ setLoading: false, autoSelect: false })
  const updated = list.find((l) => l.id === targetId) ?? null
  if (updated) {
    currentLens.value = updated
  }
  return updated
}

const refreshCurrentAnalyses = async () => {
  const headId = headLandscapeAnalysisId.value
  const displayId = displayLandscapeAnalysisId.value
  const tasks: Promise<any>[] = []
  if (headId) tasks.push(fetchLandscapeAnalysis(headId, 'head'))
  if (displayId) tasks.push(fetchLandscapeAnalysis(displayId, 'display'))
  if (tasks.length > 0) {
    await Promise.all(tasks)
  }
}

let activePollToken = 0
const pollLensUntilFinished = async (lensId: string, intervalMs = 1000, maxAttempts = Number.POSITIVE_INFINITY) => {
  const token = ++activePollToken
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(intervalMs)
    if (token !== activePollToken) {
      return null
    }
    const updated = await refreshCurrentLens(lensId)
    if (updated?.processing_state === 'fnsh') {
      await nextTick()
      await refreshCurrentAnalyses()
      return updated
    }
  }
  return null
}

// Delete a lens
async function deleteLens(lensId: string) {
  try {
    await fetchWrapper.delete(`/lens/${lensId}`)
    
    // Remove from local state
    lenses.value = lenses.value.filter(l => l.id !== lensId)
    
    // Clear selection if deleted lens was selected
    if (currentLens.value?.id === lensId) {
      currentLens.value = null
    }
    
    launchSnackbar('Lens supprimée', 'success')
  } catch (error) {
    console.error('Error deleting lens:', error)
    launchSnackbar(`Erreur lors de la suppression: ${error}`, 'error')
  }
}

// Watch for lens changes to update headLandscapeAnalysisId
watch(currentLens, (newLens) => {
  console.log('[useLens] currentLens changed:', newLens)
  if (newLens && newLens.current_landscape_id) {
    console.log('[useLens] Setting headLandscapeAnalysisId to:', newLens.current_landscape_id)
    headLandscapeAnalysisId.value = newLens.current_landscape_id
    // Also set display to head initially
    displayLandscapeAnalysisId.value = newLens.current_landscape_id
  } else {
    console.log('[useLens] No current_landscape_id, clearing state')
    headLandscapeAnalysisId.value = null
    headLandscapeAnalysis.value = null
    displayLandscapeAnalysisId.value = null
    displayLandscapeAnalysis.value = null
  }
})

// Watch for headLandscapeAnalysisId changes to fetch the head analysis
watch(headLandscapeAnalysisId, async (newAnalysisId) => {
  console.log('[useLens] headLandscapeAnalysisId changed:', newAnalysisId)
  if (newAnalysisId) {
    await fetchLandscapeAnalysis(newAnalysisId, 'head')
  } else {
    headLandscapeAnalysis.value = null
  }
})

// Watch for displayLandscapeAnalysisId changes to fetch the display analysis
watch(displayLandscapeAnalysisId, async (newAnalysisId) => {
  console.log('[useLens] displayLandscapeAnalysisId changed:', newAnalysisId)
  if (newAnalysisId) {
    await fetchLandscapeAnalysis(newAnalysisId, 'display')
  } else {
    displayLandscapeAnalysis.value = null
  }
})

// Fetch landmarks for a specific analysis
async function fetchLandmarksForAnalysis(analysisId: string) {
  isLoadingLandmarks.value = true
  try {
    const response = await fetchWrapper.get(`/analysis/${analysisId}/landmarks`)
    displayLandmarks.value = response.data
    return response.data
  } catch (error) {
    console.error('Error fetching landmarks:', error)
    launchSnackbar(`Error fetching landmarks: ${error}`, 'error')
    displayLandmarks.value = []
  } finally {
    isLoadingLandmarks.value = false
  }
}

// Fetch parents for a specific analysis
async function fetchLandscapeAnalysisParents(analysisId: string) {
  isLoadingParents.value = true
  try {
    const response = await fetchWrapper.get(`/analysis/${analysisId}/parents`)
    headLandscapeAnalysisParents.value = response.data
    return response.data
  } catch (error) {
    console.error('Error fetching landscape analysis parents:', error)
    launchSnackbar(`Error fetching landscape analysis parents: ${error}`, 'error')
    headLandscapeAnalysisParents.value = []
  } finally {
    isLoadingParents.value = false
  }
}

// Watch for headLandscapeAnalysis changes to fetch parents
watch(headLandscapeAnalysis, async (newAnalysis) => {
  console.log('[useLens] headLandscapeAnalysis changed:', newAnalysis)
  if (newAnalysis?.id) {
    // Fetch parents when head analysis changes
    console.log('[useLens] Fetching parents for analysis:', newAnalysis.id)
    await fetchLandscapeAnalysisParents(newAnalysis.id)
  } else {
    headLandscapeAnalysisParents.value = []
  }
})

// Watch for displayLandscapeAnalysis changes to fetch landmarks
watch(displayLandscapeAnalysis, async (newAnalysis) => {
  console.log('[useLens] displayLandscapeAnalysis changed:', newAnalysis)
  if (newAnalysis?.id) {
    console.log('[useLens] Fetching landmarks for analysis:', newAnalysis.id)
    await fetchLandmarksForAnalysis(newAnalysis.id)
  } else {
    displayLandmarks.value = []
  }
})

export function useLens() {
  return {
    // State
    lenses,
    currentLens,
    headLandscapeAnalysisId,
    headLandscapeAnalysis,
    displayLandscapeAnalysisId,
    displayLandscapeAnalysis,
    displayLandmarks,
    headLandscapeAnalysisParents,
    isLoadingLenses,
    isLoadingAnalysis,
    isLoadingLandmarks,
    isLoadingParents,
    
    // Actions
    loadUserLenses,
    selectLens,
    deleteLens,
    fetchLandscapeAnalysis,
    fetchLandmarksForAnalysis,
    fetchLandscapeAnalysisParents,
    updateDisplayLandscapeAnalysis,
    updateLensCurrentTrace,
    updateLensProcessingState,
    createLens
  }
}