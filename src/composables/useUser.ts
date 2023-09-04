import { ref } from 'vue'
import router from '@/router'
import { fetchWrapper } from '@/helpers'

export interface User {
  email: string
  first_name: string
  last_name: string
  handle: string
  password?: string
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

function logOut() {
    localStorage.removeItem('userId')
    user.value = null
}

async function authUser(login: any) {
  const response = await fetchWrapper.post('/sessions', login)
  if (response.status == 200) {
    const responseData = response.data
    localStorage.setItem('sessionId', responseData.id)
    localStorage.setItem('userId', responseData.user_id)
    await loadUser()
    router.push('/')
  }
}

async function createNewUser(userPayload: User) {
    if (!userPayload.handle.startsWith("@")) userPayload.handle += "@";
    try {
    const response = await fetchWrapper.post('/users', userPayload);
    authUser({ username: userPayload.email, password: userPayload.password})
    } catch (error) {
        console.log("Error : ", error);
    }
}

export function useUser() {
  return {
    user,
    loadUser,
    authUser,
    createNewUser,
    logOut,
  }
}
