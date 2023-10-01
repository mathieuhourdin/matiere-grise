import { ref } from 'vue'
import router from '@/router'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar.ts'
import { type User } from '@/types/models'

const user = ref<User | null>(null)

async function loadUser() {
  const userIdStored = localStorage.getItem('userId')
  console.log('userIdStored : ', userIdStored)
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

async function getUserById(id: string) {
  const response = await fetchWrapper.get('/users/' + id)
  return response.data
}

function logOut() {
  localStorage.removeItem('userId')
  user.value = null
}

const { launchSnackbar } = useSnackbar()
async function authUser(login: any, redirectPath: string = '/') {
  try {
    const response = await fetchWrapper.post('/sessions', login)
    const responseData = response.data
    localStorage.setItem('sessionId', responseData.id)
    localStorage.setItem('userId', responseData.user_id)
    await loadUser()
    router.push(redirectPath)
  } catch (error) {
    launchSnackbar('Wrong password or email', 'error')
  }
}

async function createNewUser(userPayload: User) {
  if (!userPayload.handle.startsWith('@')) userPayload.handle += '@'
  try {
    const response = await fetchWrapper.post('/users', userPayload)
    authUser(
      { username: userPayload.email, password: userPayload.password },
      '/platform-presentation'
    )
  } catch (error) {
    console.log('Error : ', error)
  }
}

export function useUser() {
  return {
    user,
    loadUser,
    authUser,
    createNewUser,
    logOut,
    getUserById
  }
}
