import { fetchWrapper } from '@/helpers'
import { type Interaction, type ApiInteraction } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()
import { useUser } from '@/composables/useUser'

const { user } = useUser()

function newInteraction(): Interaction {
  const interaction: Interaction = {
    interaction_progress: 0,
    interaction_date: new Date(Date.now()),
    interaction_comment: '',
    interaction_is_public: true
  }
  return interaction
}

function formatApiResponse(apiInteraction: any): ApiInteraction {
  console.log('Date : ', apiInteraction.interaction_date)
  apiInteraction.interaction_date = new Date(apiInteraction.interaction_date)
  const response: ApiInteraction = apiInteraction
  return response
}

async function getInteractions(): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get('/thought_inputs?limit=60')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function getReadAndWriteInteractions(): Promise<ApiInteraction[]> {
  const read = await fetchWrapper.get('/thought_inputs?limit=60')
  const write = await fetchWrapper.get('/thought_outputs?limit=60')
  return read.data
    .map((thoughtInput: any) => formatApiResponse(thoughtInput))
    .concat(write.data.map((thoughtOutput: any) => formatApiResponse(thoughtOutput)))
}

async function getUserReadAndWriteInteractions(id: string): Promise<ApiInteraction[]> {
  const read = await fetchWrapper.get('/users/' + id + '/thought_inputs?limit=60')
  const write = await fetchWrapper.get('/users/' + id + '/thought_outputs?limit=60')
  let drafts = { data: []}
  if (user.value && user.value.id === id) {
    drafts = await fetchWrapper.get('/users/' + id + '/thought_outputs?drafts=true')
  }
  return read.data
    .map((thoughtInput: any) => formatApiResponse(thoughtInput))
    .concat(write.data.map((thoughtOutput: any) => formatApiResponse(thoughtOutput)))
    .concat(drafts.data.map((thoughtOutput: any) => formatApiResponse(thoughtOutput)))
}

async function getUserThoughtOutputs(id: string): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get('/users/' + id + '/thought_outputs?limit=60')
  return response.data.map((thoughtOutput: any) => formatApiResponse(thoughtOutput))
}

async function getInteraction(id: string): Promise<ApiInteraction> {
  const response = await fetchWrapper.get('/thought_inputs/' + id)
  return formatApiResponse(response.data)
}

async function getUserInteractions(userId: string): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get('/users/' + userId + '/thought_inputs')
  return response.data.map((thoughtInput: any) => formatApiResponse(thoughtInput))
}

async function updateInteraction(id: string, thoughtInput: any): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
  console.log('Date : ', date_interaction_date)
  const interaction_date = date_interaction_date.toISOString().split('.')[0]
  thoughtInput.interaction_progress = Number(thoughtInput.interaction_progress)
  const response = await fetchWrapper.put('/interactions/' + id, {
    ...thoughtInput,
    interaction_date
  })
  return formatApiResponse(response.data)
}

async function createInteraction(thoughtInput: Interaction): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
  console.log('Date : ', date_interaction_date)
  const interaction_date = date_interaction_date.toISOString().split('.')[0]
  thoughtInput.interaction_progress = Number(thoughtInput.interaction_progress)
  const response = await fetchWrapper.post('/thought_inputs', { ...thoughtInput, interaction_date })
  launchSnackbar(`Creation de l'input réussie`, 'success')
  return formatApiResponse(response.data)
}

async function createInteractionForResource(
  resource_id: string,
  thoughtInput: Interaction
): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
  console.log('Date : ', date_interaction_date)
  const interaction_date = date_interaction_date.toISOString().split('.')[0]
  thoughtInput.interaction_progress = Number(thoughtInput.interaction_progress)
  const response = await fetchWrapper.post(`/resources/${resource_id}/interactions`, {
    ...thoughtInput,
    interaction_date
  })
  launchSnackbar(`Creation de l'input réussie`, 'success')
  return formatApiResponse(response.data)
}

async function getInteractionsForResource(resourceId: string): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get(`/resources/${resourceId}/interactions`)
  return response.data.map((line: ApiInteraction) => formatApiResponse(line))
}

export function useInteraction() {
  return {
    getUserInteractions,
    newInteraction,
    createInteraction,
    getInteractions,
    getInteraction,
    updateInteraction,
    createInteractionForResource,
    getInteractionsForResource,
    getUserThoughtOutputs,
    getReadAndWriteInteractions,
    getUserReadAndWriteInteractions
  }
}
