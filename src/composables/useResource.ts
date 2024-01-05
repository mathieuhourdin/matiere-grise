import { fetchWrapper } from '@/helpers'
import { type Resource, type ApiResource, type ApiInteraction } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()

const newResource = (): ApiResource => {
  return {
    id: '',
    title: '',
    subtitle: '',
    content: '',
    external_content_url: '',
    publishing_state: '',
    maturing_state: '',
    image_url: '',
    resource_type: '',
    comment: '',
    is_local_draft: true
  }
}

const getResource = async (id: string): Promise<ApiResource> => {
  try {
    const response = await fetchWrapper.get('/resources/' + id)
    response.data.is_local_draft = false
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting resource : ${error}`, 'error')
    throw error
  }
}
const getResources = async (): Promise<ApiResource[]> => {
  try {
    const response = await fetchWrapper.get('/resources?limit=60')
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting resources : ${error}`, 'error')
    throw error
  }
}
const updateResource = async (id: string, resource: Resource) => {
  try {
    const response = await fetchWrapper.put('/resources/' + id, resource)
    launchSnackbar(`Mise à jour de l'output ${id} réussie`, 'success')
    return response
  } catch (error) {
    launchSnackbar(`Error updating resource : ${error}`, 'error')
    throw error
  }
}
const createResource = async (resource: Resource) => {
  try {
    const response = await fetchWrapper.post('/resources', resource)
    return response.data
  } catch (error) {
    launchSnackbar(`Error updating resource : ${error}`, 'error')
    throw error
  }
}
async function getAuthorInteractionForResource(resource_id: string): Promise<ApiInteraction> {
  const response = await fetchWrapper.get('/resources/' + resource_id + '/author_interaction')
  return response.data
}

export function useResource() {
  return {
    newResource,
    getResource,
    getResources,
    updateResource,
    createResource,
    getAuthorInteractionForResource
  }
}
