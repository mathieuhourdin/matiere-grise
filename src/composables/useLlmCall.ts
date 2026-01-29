import { fetchWrapper } from '@/helpers'
import { type LlmCall } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'

const { launchSnackbar } = useSnackbar()

const getLlmCall = async (id: string): Promise<LlmCall> => {
  try {
    const response = await fetchWrapper.get('/llm_calls/' + id)
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting LLM call: ${error}`, 'error')
    throw error
  }
}

const getLlmCalls = async (params: any = {}): Promise<LlmCall[]> => {
  try {
    const queryString = Object.keys(params)
      .map((key: string) => `${key}=${params[key]}`)
      .join('&')
    const response = await fetchWrapper.get('/llm_calls?limit=100&' + queryString)
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting LLM calls: ${error}`, 'error')
    throw error
  }
}

export function useLlmCall() {
  return {
    getLlmCall,
    getLlmCalls
  }
}

