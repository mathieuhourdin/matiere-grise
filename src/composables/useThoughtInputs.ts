import { fetchWrapper } from '@/helpers'

export interface ThoughtInput {
  id?: string
  resource_title: string
  resource_author_name: string
  input_date: Date
}

function formatApiResponse(apiThoughtInput: any): ThoughtInput {
  console.log('Date : ', apiThoughtInput.input_date)
  apiThoughtInput.input_date = new Date(apiThoughtInput.input_date)
  const response: ThoughtInput = apiThoughtInput
  return response
}

async function getUserThoughtInputs(userId: string): Promise<[ThoughtInput]> {
  const response = await fetchWrapper.get('/users/' + userId + '/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

export function useThoughtInputs() {
  return {
    getUserThoughtInputs
  }
}
