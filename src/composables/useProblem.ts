import { type Problem } from '@/types/models'
import { fetchWrapper } from '@/helpers'
import { useThoughtOutput } from '@/composables/useThoughtOutput'

const { createThoughtOutput } = useThoughtOutput()

const problemsList = [
  {
    id: 'dqjskjskjskj',
    title: 'Que peut-on sauver du passé ?',
    image_url:
      'https://i0.wp.com/www.experiencesmexique.com/wp-content/uploads/2021/02/La-civilisation-Azteque.jpg?fit=800%2C388&ssl=1',
    description:
      "Avons-nous hérité de certains acquis dans les premières années de la civilisation, pour réagir aux périls, dont nous pourrions encore nous servir aujourd'hui ? La fiction littéraire, le langage, la répartition des rôles ? Est ce qu'on doit tout rejeter (tout ça ne servait qu'à asservir, opprimer) ou peut (doit?) on en sauver une partie ?",
    owner_id: 'mathieu',
    inputs: 3,
    created_at: new Date(Date.now())
  },
  {
    id: 'uuuuuuuuuuabddeue',
    title: 'Mythes, vérité et usage',
    image_url: 'https://francoisloth.files.wordpress.com/2012/10/sans-titre-1.jpg?w=300&h=236',
    description:
      "Si la signification des concepts est les différences d'état des choses que ces concepts impliquent, et que certains concepts n'ont aucune conséquence dans les états de choses, ces concepts peuvent ils logiquement impliquer une façon différente de vivre comme le suggère William James ?",
    owner_id: 'mathieu',
    inputs: 2,
    created_at: new Date(Date.now())
  }
]

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
