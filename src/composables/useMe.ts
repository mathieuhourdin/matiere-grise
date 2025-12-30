import { ref } from 'vue'
import { type Interaction } from '@/types/models'
import { useInteraction } from '@/composables/useInteraction'
import { useUser } from '@/composables/useUser'

const { user } = useUser()

const { getInteractions } = useInteraction()

const userJournals = ref<Interaction[]>([])
const userLogLecture = ref<Interaction | null>(null)
const userLogProduction = ref<Interaction | null>(null)

const loadUserJournal = async () => {
    const interactions = await getInteractions({ interaction_type: 'outp', interaction_user_id: user.value?.id, resource_type: 'jrnl' })

    userJournals.value = interactions;
}

export function useMe() {
  return {
    loadUserJournal,
    userJournals,
    userLogLecture,
    userLogProduction
  }
}