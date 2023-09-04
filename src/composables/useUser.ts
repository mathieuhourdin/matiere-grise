import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'

export interface User {
  email: string
  first_name: string
  last_name: string
  handle: string
}

const user = ref<User | null>(null)

async function loadUser() {
  const userIdStored = localStorage.getItem('userId')
  console.log("userIdStored : ", userIdStored);
  if (!userIdStored) {
    user.value = null
    return
  }
  try {
    const response = await fetchWrapper.get('/users/' + userIdStored)
    user.value = response.data
  } catch (error) {
    user.value = null
  }
}

export function useUser() {
  return {
    user,
    loadUser
  }
}
