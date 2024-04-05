<template>
  <div class="flex flex-col mt-4">
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
