import { fetchWrapper } from '@/helpers'
import { type ThoughtInput, type ApiThoughtInput } from '@/types/models'

function newThoughtInput(): ThoughtInput {
  const thought_input: ThoughtInput = {
    resource_title: '',
    resource_author_name: '',
    resource_type: '',
    resource_external_content_url: '',
    resource_image_url: '',
    resource_comment: '',
    interaction_progress: 0,
    interaction_date: new Date(Date.now()),
    interaction_comment: '',
    interaction_is_public: true
  }
  return thought_input
}

function formatApiResponse(apiThoughtInput: any): ApiThoughtInput {
  console.log('Date : ', apiThoughtInput.interaction_date)
  apiThoughtInput.interaction_date = new Date(apiThoughtInput.interaction_date)
  const response: ApiThoughtInput = apiThoughtInput
  return response
}

async function getThoughtInputs(): Promise<ApiThoughtInput[]> {
  const response = await fetchWrapper.get('/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function getThoughtInput(id: string): Promise<ApiThoughtInput> {
  const response = await fetchWrapper.get('/thought_inputs/' + id)
  return formatApiResponse(response.data)
}

async function getUserThoughtInputs(userId: string): Promise<ApiThoughtInput[]> {
  const response = await fetchWrapper.get('/users/' + userId + '/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function createThoughtInput(thoughtInput: ThoughtInput): Promise<ApiThoughtInput> {
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
