import { fetchWrapper } from '@/helpers'
import { type Interaction, type Resource, type ApiInteraction } from '@/types/models'

function newThoughtInput(): Interaction {
  const resource: Resource = {
    resource_title: '',
    resource_subtitle: '',
    resource_content: '',
    resource_external_content_url: '',
    resource_publishing_state: 'pbsh',
    resource_maturing_state: 'fnsh',
    resource_image_url: '',
    resource_type: '',
    resource_comment: '',
  }
  const thought_input: Interaction = {
    interaction_progress: 0,
    interaction_date: new Date(Date.now()),
    interaction_comment: '',
    interaction_is_public: true,
    resource: resource
  }
  return thought_input
}

function formatApiResponse(apiThoughtInput: any): ApiInteraction {
  console.log('Date : ', apiThoughtInput.interaction_date)
  apiThoughtInput.interaction_date = new Date(apiThoughtInput.interaction_date)
  const response: ApiInteraction = apiThoughtInput
  return response
}

async function getThoughtInputs(): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get('/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function getThoughtInput(id: string): Promise<ApiInteraction> {
  const response = await fetchWrapper.get('/thought_inputs/' + id)
  return formatApiResponse(response.data)
}

async function getUserThoughtInputs(userId: string): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get('/users/' + userId + '/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function createThoughtInput(thoughtInput: Interaction): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
  console.log('Date : ', date_interaction_date)
  const interaction_date = date_interaction_date.toISOString().split('.')[0]
  thoughtInput.interaction_progress = Number(thoughtInput.interaction_progress)
  const response = await fetchWrapper.post('/thought_inputs', { ...thoughtInput, interaction_date })
  return formatApiResponse(response.data)
}

export function useThoughtInputs() {
  return {
    getUserThoughtInputs,
    newThoughtInput,
    createThoughtInput,
    getThoughtInputs,
    getThoughtInput
  }
}
