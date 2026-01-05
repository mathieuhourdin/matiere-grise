import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from './useUser'

const isOpen = ref(false)
const context = ref<string | null>(null)
let watchInitialized = false

export function useQuickCreateModal() {
  const { user, isUserLoaded } = useUser()
  const route = useRoute()

  const openModal = (contextValue: string) => {
    context.value = contextValue
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const handleResourceCreated = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    openModal,
    closeModal,
    handleResourceCreated,
    context
  }
}
