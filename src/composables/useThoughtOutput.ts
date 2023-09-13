import { fetchWrapper } from '@/helpers'
import { type ThoughtOutput } from '@/types/models'

const getThoughtOutput = async (id: string) => {
  const response = await fetchWrapper.get('/thought_outputs/' + id)
  return response.data
}
const updateThoughtOutput = async (id: string, thoughtOutput: ThoughtOutput) => {
  thoughtOutput.progress = Number(thoughtOutput.progress)
  const response = await fetchWrapper.put('/thought_outputs/' + id, thoughtOutput)
  return response
}
const createThoughtOutput = async (thoughtOutput: ThoughtOutput) => {
  thoughtOutput.progress = Number(thoughtOutput.progress)
  const response = await fetchWrapper.post('/thought_outputs', thoughtOutput)
  return response.data
}
export function useThoughtOutput() {
  return {
    getThoughtOutput,
    updateThoughtOutput,
    createThoughtOutput
  }
}
