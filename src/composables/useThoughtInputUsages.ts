import { fetchWrapper } from '@/helpers'

const getThoughtInputUsagesForThoughtOutput = async (thought_output_id: string) => {
  const response = await fetchWrapper.get(
    '/thought_outputs/' + thought_output_id + '/thought_input_usages'
  )
  return response.data
}

const createThoughtInputUsage = async (thought_input_usage: any) => {
    const response = await fetchWrapper.post(
        '/thought_input_usages',
        thought_input_usage
    )
    return response.data
}

export function useThoughtInputUsages() {
  return {
    getThoughtInputUsagesForThoughtOutput,
    createThoughtInputUsage
  }
}
