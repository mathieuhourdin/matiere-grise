import { ref } from 'vue'
import { type ApiInteraction } from '@/types/models'
import { useInteraction } from '@/composables/useInteraction'
import { useUser } from '@/composables/useUser'

const { user } = useUser()
const { getInteractions } = useInteraction()

const userJournals = ref<ApiInteraction[]>([])

const loadUserJournal = async () => {
  if (!user.value?.id) {
    console.warn('[useJournal] User not found, skipping loadUserJournal')
    return
  }
  
  const interactions = await getInteractions({ 
    interaction_type: 'outp', 
    interaction_user_id: user.value.id, 
    resource_type: 'jrnl' 
  })

  userJournals.value = interactions
}

export function useJournal() {
  return {
    userJournals,
    loadUserJournal
  }
}
