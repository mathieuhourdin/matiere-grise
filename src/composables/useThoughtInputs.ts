import { fetchWrapper } from '@/helpers'
import { type ThoughtInput, type ApiThoughtInput } from '@/types/models'

function newThoughtInput(): ThoughtInput {
  const thought_input: ThoughtInput = {
    resource_title: '',
    resource_author_name: '',
    resource_type: '',
    resource_link: '',
    resource_image_link: '',
    resource_comment: '',
    input_progress: 0,
    input_date: new Date(Date.now()),
    input_comment: '',
    input_is_public: true
  }
  return thought_input
}

function formatApiResponse(apiThoughtInput: any): ApiThoughtInput {
  console.log('Date : ', apiThoughtInput.input_date)
  apiThoughtInput.input_date = new Date(apiThoughtInput.input_date)
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
  const date_input_date = new Date(thoughtInput.input_date)
  console.log('Date : ', date_input_date)
  const input_date = date_input_date.toISOString().split('.')[0]
  thoughtInput.input_progress = Number(thoughtInput.input_progress)
  const response = await fetchWrapper.post('/thought_inputs', { ...thoughtInput, input_date })
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
