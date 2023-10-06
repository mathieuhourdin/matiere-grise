import { fetchWrapper } from '@/helpers'

const getThoughtInputUsagesForResource = async (resource_id: string) => {
  const response = await fetchWrapper.get(
    '/resource/' + resource_id + '/thought_input_usages'
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
    getThoughtInputUsagesForResource,
    createThoughtInputUsage
  }
}
