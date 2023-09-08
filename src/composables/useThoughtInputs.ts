import { fetchWrapper } from '@/helpers'

export interface ThoughtInput {
  id?: string
  resource_title: string
  resource_author: string
  input_date: Date
}

async function getUserThoughtInputs(userId: string) {
  const response = await fetchWrapper.get('/users/' + userId + '/thought_inputs')
  return response.data
}

export function useThoughtInputs() {
  return {
    getUserThoughtInputs
  }
}
