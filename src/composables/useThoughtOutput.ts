import { fetchWrapper } from '@/helpers'
import { type ThoughtOutput, type ApiThoughtOutput } from '@/types/models'

const newThoughtOutput = (): ApiThoughtOutput => {
  return {
    id: '',
    resource_title: '',
    resource_subtitle: '',
    resource_image_url: '',
    progress: 0,
    resource_content: '',
    publishing_state: '',
    resource_type: ''
  }
}

const getThoughtOutput = async (id: string): Promise<ApiThoughtOutput> => {
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
    newThoughtOutput,
    getThoughtOutput,
    updateThoughtOutput,
    createThoughtOutput
  }
}
