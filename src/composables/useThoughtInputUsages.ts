import { fetchWrapper } from '@/helpers'

const getThoughtInputUsagesForThoughtOutput = async (thought_output_id: string) => {
  const response = await fetchWrapper.get(
    '/thought_outputs/' + thought_output_id + '/thought_input_usages'
  )
  return response.data
}

export function useThoughtInputUsages() {
  return {
    getThoughtInputUsagesForThoughtOutput
  }
}
