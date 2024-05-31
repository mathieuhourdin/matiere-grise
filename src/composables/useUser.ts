import { ref } from 'vue'
import router from '@/router'
import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar.ts'
import { type User } from '@/types/models'

const { launchSnackbar } = useSnackbar()

const user = ref<User | null>(null)

const isUserLoaded = ref<boolean>(false)

async function loadUser() {
  const userIdStored = localStorage.getItem('userId')
  console.log('userIdStored : ', userIdStored)
  if (!userIdStored) {
    user.value = null
    isUserLoaded.value = true
    return
  }
  try {
    const response = await fetchWrapper.get('/users/' + userIdStored)
    user.value = response.data
    isUserLoaded.value = true
  } catch (error) {
    user.value = null
    isUserLoaded.value = true
  }
}

async function getUserById(id: string) {
  const response = await fetchWrapper.get('/users/' + id)
  return response.data
}

async function getUsers() {
  const response = await fetchWrapper.get('/users')
  return response.data
}

async function updateUser(id: string, user: User) {
  const response = await fetchWrapper.put('/users/' + id, user)
  return response.data
}

const debouncedTimeout = ref<number | null>(null)

async function debouncedUpdateUser(id: string, user: User) {
  if (debouncedTimeout.value !== null) clearTimeout(debouncedTimeout.value)
  debouncedTimeout.value = setTimeout(async () => {
    try {
      await updateUser(id, user)
    } catch (error) {
      console.log('An error : ', error)
      launchSnackbar('Cant update user', 'error')
    }
  }, 1000)
}

function logOut() {
  localStorage.removeItem('userId')
  user.value = null
  router.push({ path: '/login' })
}

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

async function createNewDraftUser() {
  try {
    const draftAuthor = {
      first_name: '',
      last_name: '',
      email: '',
      handle: '',
      profile_picture_url: '',
      is_platform_user: false,
      biography: ''
    }
    const response = await fetchWrapper.post('/users', draftAuthor)
    return response.data
  } catch (error) {
    launchSnackbar('Error creating author', 'error')
  }
}

async function createNewUser(userPayload: User) {
  if (!userPayload.handle.startsWith('@')) userPayload.handle = '@' + userPayload.handle
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
    getUserById,
    getUsers,
    updateUser,
    debouncedUpdateUser,
    createNewDraftUser,
    isUserLoaded
  }
}
