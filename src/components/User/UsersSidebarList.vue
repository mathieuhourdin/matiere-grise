<template>
  <div class="flex flex-col mt-4">
    <router-link to="/users" class="mb-2 text-lg font-black text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200" >Utilisateurs</router-link>
    <UserMini v-for="user in users" :user="user" class="grow mb-2" />
  </div>
</template>

<script setup lang="ts">
import UserMini from '@/components/User/UserMini.vue'
import { useUser } from '@/composables/useUser'
import { ref, onMounted } from 'vue'

const { getUsers } = useUser()

const users = ref<User[]>([])

onMounted(async () => {
  users.value = await getUsers()
})
</script>
