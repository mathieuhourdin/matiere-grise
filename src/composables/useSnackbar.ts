import { ref } from 'vue'
const snackbar = ref<any | null>(null)
const launchSnackbar = (message: string, type: string) => {
    snackbar.value = { message, type }
    setTimeout(() => snackbar.value = null, 2000)
}

export function useSnackbar() {
    return {launchSnackbar, snackbar}
}
