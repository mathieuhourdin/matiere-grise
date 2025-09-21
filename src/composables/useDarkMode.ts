import { ref, computed, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  // Initialize dark mode from localStorage or system preference
  const initializeDarkMode = () => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDark.value = savedTheme === 'true'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyDarkMode()
  }

  // Apply dark mode to document
  const applyDarkMode = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', isDark.value.toString())
    applyDarkMode()
  }

  // Set dark mode explicitly
  const setDarkMode = (value: boolean) => {
    isDark.value = value
    localStorage.setItem('darkMode', value.toString())
    applyDarkMode()
  }

  // Computed properties
  const isDarkMode = computed(() => isDark.value)
  const isLightMode = computed(() => !isDark.value)

  // Watch for system theme changes
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        isDark.value = e.matches
        applyDarkMode()
      }
    })
  }

  // Initialize on mount
  onMounted(() => {
    initializeDarkMode()
    watchSystemTheme()
  })

  return {
    isDarkMode,
    isLightMode,
    toggleDarkMode,
    setDarkMode
  }
}
