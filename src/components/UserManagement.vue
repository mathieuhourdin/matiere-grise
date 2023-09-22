<template>
  <div>
    <router-link v-if="!user" to="/login"> Login </router-link>
    <div v-else class="flex max-h-full">
      <router-link :to="'/users/' + user.id" class="text-xs md:text-base my-auto text-right"
        >{{ user.first_name }} {{ user.last_name }}</router-link
      >
      <ArrowRightOnRectangleIcon class="h-6 m-1" @click="logOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser.ts'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'

const { user, loadUser, logOut } = useUser()

onMounted(() => loadUser())
</script>
