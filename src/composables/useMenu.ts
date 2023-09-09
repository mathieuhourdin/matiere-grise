import { ref } from 'vue'

const menuOpen = ref(false)

const setMenuOpen = (isMenuOpen: boolean) => {
  menuOpen.value = isMenuOpen
}

const toggleMenuOpen = () => {
  menuOpen.value = !menuOpen.value
}

export function useMenu() {
  return {
    menuOpen,
    setMenuOpen,
    toggleMenuOpen
  }
}
