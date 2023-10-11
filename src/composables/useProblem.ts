import { type Resource, type Interaction } from '@/types/models'
import { fetchWrapper } from '@/helpers'
import { useResource } from '@/composables/useResource'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()

const { createResource } = useResource()

const newProblem = () => {
  const resource: Resource = {
    title: '',
    subtitle: '',
    content: '',
    external_content_url: '',
    publishing_state: 'drft',
    maturing_state: 'idea',
    image_url: '',
    resource_type: 'pblm',
    comment: '',
  }
  const problem: Interaction = {
    interaction_progress: 0,
    interaction_comment: '',
    interaction_date: new Date(Date.now()),
    resource: resource,
    interaction_is_public: true
  }
  return problem
}

const formatProblem = (problem: any): Resource => {
  if (problem.created_at) {
    problem.created_at = new Date(problem.created_at.split('.')[0])
  }
  const formattedProblem: Resource = problem
  return formattedProblem
}

const getProblems = async (): Promise<Resource[]> => {
  const problems = await fetchWrapper.get('/problems')
  return problems.data.map((problem: any) => formatProblem(problem))
}

const createProblem = async (problem: Interaction) => {
  try {
    const payload = {
      ...problem,
      interaction_date: problem.interaction_date?.toISOString().split('.')[0]
    }
    const response = await fetchWrapper.post('/thought_outputs', payload)
    return response.data
  } catch (error) {
    launchSnackbar(`Error updating resource : ${error}`, 'error')
    throw error
  }
}

export function useProblem() {
  return { newProblem, getProblems, createProblem }
}
