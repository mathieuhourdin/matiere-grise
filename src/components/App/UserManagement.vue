<template>
  <div>
    <router-link v-if="!user" to="/login" @click="routeToLogin"> Login </router-link>
    <div v-else class="flex max-h-full">
      <router-link :to="'/users/' + user.id" class="text-xs md:text-base my-auto text-right"
        >{{ user.first_name }} {{ user.last_name }}</router-link
      >
      <ArrowRightOnRectangleIcon class="h-6 m-1" @click="logOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { user, loadUser, logOut } = useUser()

const router = useRouter()
const route = useRoute()

const routeToLogin = () => {
  router.push({ path: "/login", query: { ...route.query, redirectPath: route.path }})
}

onMounted(() => loadUser())
</script>
