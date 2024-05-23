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

const resourceTypeOptions = [
  { text: 'book', value: 'book' },
  { text: 'readingNote', value: 'rdnt' },
  { text: 'resourceList', value: 'list' },
  { text: 'problem', value: 'pblm' },
  { text: 'researchArticle', value: 'ratc' },
  { text: 'newsArticle', value: 'natc' },
  { text: 'opinionArticle', value: 'oatc' },
  { text: 'movie', value: 'movi' },
  { text: 'video', value: 'vide' },
  { text: 'podcast', value: 'pcst' },
  { text: 'song', value: 'song' },
  { text: 'course', value: 'curs' },
  { text: 'idea', value: 'idea' }
]

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
const getResources = async (params: any = {}): Promise<ApiResource[]> => {
  try {
    const queryString = Object.keys(params).map((key: string) => `${key}=${params[key]}`).join('&');
    const response = await fetchWrapper.get('/resources?limit=60&' + queryString)
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
    getAuthorInteractionForResource,
    resourceTypeOptions
  }
}
