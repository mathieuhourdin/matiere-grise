import { fetchWrapper } from '@/helpers'

const getResourceRelationsForResource = async (resource_id: string) => {
  const response = await fetchWrapper.get('/resource/' + resource_id + '/bibliography')
  return response.data
}
const getUsagesForResource = async (resource_id: string) => {
  const response = await fetchWrapper.get('/resource/' + resource_id + '/usages')
  return response.data
}

const getAllRelationsForResource = async (resource_id: string) => {
  const responseBiblio = await fetchWrapper.get('/resource/' + resource_id + '/bibliography')
  const responseUsages = await fetchWrapper.get('/resource/' + resource_id + '/usages')
  return responseBiblio.data.concat(responseUsages.data)
}

const createResourceRelation = async (thought_input_usage: any) => {
  const response = await fetchWrapper.post('/thought_input_usages', thought_input_usage)
  return response.data
}

export function useResourceRelations() {
  return {
    getResourceRelationsForResource,
    createResourceRelation,
    getUsagesForResource,
    getAllRelationsForResource
  }
}
