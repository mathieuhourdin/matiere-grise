import { fetchWrapper } from '@/helpers'
import { type ThoughtOutput, type ApiThoughtOutput } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()

const newThoughtOutput = (): ApiThoughtOutput => {
  return {
    id: '',
    resource_title: '',
    resource_subtitle: '',
    resource_image_url: '',
    interaction_progress: 0,
    resource_content: '',
    resource_publishing_state: '',
    resource_type: ''
  }
}

const getThoughtOutput = async (id: string): Promise<ApiThoughtOutput> => {
  try {
    const response = await fetchWrapper.get('/thought_outputs/' + id)
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting thought output : ${error}`, 'error')
    throw error
  }
}
const updateThoughtOutput = async (id: string, thoughtOutput: ThoughtOutput) => {
  try {
    thoughtOutput.interaction_progress = Number(thoughtOutput.interaction_progress)
    const response = await fetchWrapper.put('/thought_outputs/' + id, thoughtOutput)
    launchSnackbar(`Mise à jour de l'output ${id} réussie`, 'success')
    return response
  } catch (error) {
    launchSnackbar(`Error updating thought output : ${error}`, 'error')
    throw error
  }
}
const createThoughtOutput = async (thoughtOutput: ThoughtOutput) => {
  try {
    thoughtOutput.interaction_progress = Number(thoughtOutput.interaction_progress)
    const response = await fetchWrapper.post('/thought_outputs', thoughtOutput)
    return response.data
  } catch (error) {
    launchSnackbar(`Error updating thought output : ${error}`, 'error')
    throw error
  }
}
export function useThoughtOutput() {
  return {
    newThoughtOutput,
    getThoughtOutput,
    updateThoughtOutput,
    createThoughtOutput
  }
}
