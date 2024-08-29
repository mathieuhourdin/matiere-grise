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

const interactionSortFunction = (interaction: any) => {
  if (interaction.interaction_type === 'inpt') {
    return new Date(interaction.created_at)
  } else {
    return interaction.resource.updated_at
      ? new Date(interaction.resource.updated_at)
      : new Date(interaction.resource.created_at)
  }
}

function formatApiResponse(apiInteraction: any): ApiInteraction {
  apiInteraction.interaction_date = new Date(apiInteraction.interaction_date)
  const response: ApiInteraction = apiInteraction
  return response
}

async function getInteractions(query: any = {}): Promise<ApiInteraction[]> {
  const queryString = Object.keys(query)
    .map((key: string) => `${key}=${query[key]}`)
    .join('&')
  const response = await fetchWrapper.get('/interactions?limit=60&' + queryString)
  return response.data.map((interaction: any) => formatApiResponse(interaction))
}

async function getUserInteractions(
  userId: string,
  interactionType: string = 'inpt',
  maturingState: string = 'fnsh'
): Promise<ApiInteraction[]> {
  const response = await fetchWrapper.get(
    `/users/${userId}/interactions?interaction_type=${interactionType}&maturing_state=${maturingState}`
  )
  return response.data.map((interaction: any) => formatApiResponse(interaction))
}

async function getReadAndWriteInteractions(): Promise<ApiInteraction[]> {
  const read = await getInteractions({ interaction_type: 'inpt' })
  const write = await getInteractions({ interaction_type: 'outp' })
  return read.concat(write)
}

async function getUserReadAndWriteInteractions(id: string): Promise<ApiInteraction[]> {
  const read = await getInteractions({ interaction_type: 'inpt', interaction_user_id: id })
  const write = await getInteractions({ interaction_type: 'outp', interaction_user_id: id })

  let drafts: any[] = []
  if (user.value && user.value.id === id) {
    drafts = await getInteractions({
      interaction_type: 'outp',
      maturing_state: 'drft',
      interaction_user_id: id
    })
  }
  return read
    .map((thoughtInput: any) => formatApiResponse(thoughtInput))
    .concat(write.map((thoughtOutput: any) => formatApiResponse(thoughtOutput)))
    .concat(drafts.map((thoughtOutput: any) => formatApiResponse(thoughtOutput)))
}

async function updateInteraction(id: string, thoughtInput: any): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
  const interaction_date = date_interaction_date.toISOString().split('.')[0]
  thoughtInput.interaction_progress = Number(thoughtInput.interaction_progress)
  const response = await fetchWrapper.put('/interactions/' + id, {
    ...thoughtInput,
    interaction_date
  })
  return formatApiResponse(response.data)
}

async function createInteractionForResource(
  resource_id: string,
  thoughtInput: Interaction
): Promise<ApiInteraction> {
  const date_interaction_date = new Date(thoughtInput.interaction_date)
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
    getInteractions,
    updateInteraction,
    createInteractionForResource,
    getInteractionsForResource,
    getReadAndWriteInteractions,
    getUserReadAndWriteInteractions,
    interactionSortFunction
  }
}
