import { ref, computed } from 'vue'

const menuOpen = ref(screen.width > 760)

const headerValue = ref<{ link: string; text: string } | null>(null)

const feedFilter = ref('all')

const setMenuOpen = (isMenuOpen: boolean) => {
  menuOpen.value = isMenuOpen
}

const toggleMenuOpen = () => {
  menuOpen.value = !menuOpen.value
}

const isMobile = computed(() => {
  return screen.width <= 760
})

export function useMenu() {
  return {
    menuOpen,
    setMenuOpen,
    toggleMenuOpen,
    isMobile,
    headerValue,
    feedFilter
  }
}
