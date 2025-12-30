import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from './useUser'

const isOpen = ref(false)
const context = ref<string | null>(null)
let watchInitialized = false

export function useQuickCreateModal() {
  const { user, isUserLoaded } = useUser()
  const route = useRoute()

  // Show modal when user arrives (once per session) - only initialize once
  if (!watchInitialized) {
    watchInitialized = true
    watch([isUserLoaded, () => user.value, () => route.name], ([loaded, currentUser, routeName]) => {
      if (loaded && currentUser && routeName !== 'login') {
        const hasShownModal = sessionStorage.getItem('quickCreateModalShown')
        if (!hasShownModal) {
          // Small delay to ensure UI is ready
          setTimeout(() => {
            isOpen.value = true
            sessionStorage.setItem('quickCreateModalShown', 'true')
          }, 500)
        }
      }
    }, { immediate: true })
  }

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
