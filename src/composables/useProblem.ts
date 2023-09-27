import { type Problem } from '@/types/models'
import { fetchWrapper } from '@/helpers'
import { useThoughtOutput } from '@/composables/useThoughtOutput'

const { createThoughtOutput } = useThoughtOutput()

const newProblem = () => {
  const problem: Problem = {
    resource_title: '',
    resource_subtitle: '',
    resource_content: '',
    publishing_state: 'drft',
    resource_image_url: '',
    resource_type: 'pblm',
    progress: 0,
    resource_comment: '',
    maturing_state: ''
  }
  return problem
}

const formatProblem = (problem: any): Problem => {
  if (problem.created_at) {
    problem.created_at = new Date(problem.created_at.split(".")[0])
  }
  const formattedProblem: Problem = problem
  return formattedProblem
}

const getProblems = async (): Promise<Problem[]> => {
  const problems = await fetchWrapper.get('/problems')
  return problems.data.map((problem: any) => formatProblem(problem))
}

export function useProblem() {
  return { newProblem, getProblems, createProblem: createThoughtOutput }
}
