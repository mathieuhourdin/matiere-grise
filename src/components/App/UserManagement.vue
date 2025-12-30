<template>
    <router-link v-if="!user" to="/app/login" @click="routeToLogin" class="text-xs my-auto md:text-base">
      Login
    </router-link>
    <div v-else class="flex max-h-full">
      <router-link :to="'/me/home'" class="flex text-xs md:text-base my-auto text-right"
        ><UserAvatar :user="user"
      /></router-link>
      <ArrowRightOnRectangleIcon class="h-6 m-1" @click="logOut" />
    </div>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/User/UserAvatar.vue'
import { useUser } from '@/composables/useUser'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { user, loadUser, logOut } = useUser()

const router = useRouter()
const route = useRoute()

const routeToLogin = () => {
  router.push({ path: '/app/login', query: { ...route.query, redirectPath: route.path } })
}

onMounted(() => loadUser())
</script>
