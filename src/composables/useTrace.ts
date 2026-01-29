import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar'
import { useUser } from '@/composables/useUser'
import { type ApiTrace } from '@/types/models'

const { launchSnackbar } = useSnackbar()
const { user } = useUser()

// State
const traces = ref<ApiTrace[]>([])
const isLoadingTraces = ref(false)

// Fetch full trace data by ID
async function fetchTraceById(traceId: string): Promise<ApiTrace | null> {
  try {
    const response = await fetchWrapper.get(`/traces/${traceId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching trace ${traceId}:`, error)
    return null
  }
}

// Fetch all traces for the current user
async function loadUserTraces() {
  console.log('[useTrace] loadUserTraces called, user:', user.value)
  if (!user.value?.id) {
    console.warn('[useTrace] User not found, skipping loadUserTraces')
    return
  }
  
  isLoadingTraces.value = true
  try {
    console.log('[useTrace] Fetching traces for user:', user.value.id)
    const response = await fetchWrapper.get(`/users/${user.value.id}/traces`)
    const traceList = response.data
    console.log('[useTrace] Traces list loaded:', traceList)
    
    // Fetch full data for each trace
    const fullTraces = await Promise.all(
      traceList.map(async (trace: ApiTrace) => {
        if (trace.id) {
          const fullTrace = await fetchTraceById(trace.id)
          return fullTrace || trace
        }
        return trace
      })
    )
    
    traces.value = fullTraces.filter((trace): trace is ApiTrace => trace !== null)
    console.log('[useTrace] Full traces loaded:', traces.value)
  } catch (error) {
    console.error('Error loading traces:', error)
    launchSnackbar(`Error loading traces: ${error}`, 'error')
  } finally {
    isLoadingTraces.value = false
  }
}

export function useTrace() {
  return {
    // State
    traces,
    isLoadingTraces,
    
    // Actions
    loadUserTraces
  }
}
