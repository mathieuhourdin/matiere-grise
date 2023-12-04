<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-16">
    <UserCard v-for="(user, i) in users" :key="i" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCard from '@/components/User/UserCard.vue'
import { useUser } from '@/composables/useUser'
import { type User } from '@/types/models'
import { ref, onMounted } from 'vue'

const { getUsers } = useUser()

const users = ref<User[]>([])

onMounted(async () => (users.value = await getUsers()))
</script>
