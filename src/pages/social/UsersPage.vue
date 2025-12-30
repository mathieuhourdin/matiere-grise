<template>
  <div class="m-4">
    <div class="underline italic" @click="createDrafAuthorAndRedirect">Créer un auteur</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-16">
      <UserCard v-for="(user, i) in users" :key="i" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCard from '@/components/User/UserCard.vue'
import { useUser } from '@/composables/useUser'
import { type User } from '@/types/models'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { getUsers, createNewDraftUser } = useUser()

const users = ref<User[]>([])

const createDrafAuthorAndRedirect = async () => {
  const createdDraftAuthor = await createNewDraftUser()
  router.push({ path: '/social/users/' + createdDraftAuthor.id, query: { editingUser: 'true' } })
}

onMounted(async () => (users.value = await getUsers()))
</script>
