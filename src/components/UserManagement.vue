<template>
  <div>
    <router-link v-if="!user" to="/login"> Login </router-link>
    <div v-else class="flex max-h-full">
      <div class="text-sm">{{ user.first_name }} {{ user.last_name }}</div>
      <ArrowRightOnRectangleIcon @click="logOut"/>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '@/composables/useUser.ts'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'

const { user, loadUser, logOut } = useUser()

onMounted(() => loadUser())
</script>
