import { type Resource } from '@/types/models'
import { fetchWrapper } from '@/helpers'
import { useThoughtOutput } from '@/composables/useThoughtOutput'

const { createThoughtOutput } = useThoughtOutput()

const newProblem = () => {
  const problem: Resource = {
    resource_id: '',
    resource_title: '',
    resource_subtitle: '',
    resource_content: '',
    resource_external_content_url: '',
    resource_publishing_state: 'drft',
    resource_maturing_state: 'idea',
    resource_image_url: '',
    resource_type: 'pblm',
    resource_comment: '',
    resource_category_id: '',
  }
  return problem
}

const formatProblem = (problem: any): Resource => {
  if (problem.created_at) {
    problem.created_at = new Date(problem.created_at.split(".")[0])
  }
  const formattedProblem: Resource = problem
  return formattedProblem
}

const getProblems = async (): Promise<Resource[]> => {
  const problems = await fetchWrapper.get('/problems')
  return problems.data.map((problem: any) => formatProblem(problem))
}

export function useProblem() {
  return { newProblem, getProblems, createProblem: createThoughtOutput }
}
