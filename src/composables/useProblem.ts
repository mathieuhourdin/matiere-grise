import { type Problem } from '@/types/models'
import { fetchWrapper } from '@/helpers'
import { useThoughtOutput } from '@/composables/useThoughtOutput'

const { createThoughtOutput } = useThoughtOutput()

const newProblem = () => {
  const problem: Problem = {
    title: '',
    description: '',
    content: '',
    publishing_state: 'drft',
    image_url: '',
    output_type: 'pblm',
    progress: 0,
    potential_improvements: '',
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
