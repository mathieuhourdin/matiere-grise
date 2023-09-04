<template>
  <div>
    <router-link
      v-if="!user"
      to="/login"
    >
    Login
    </router-link>
    <div v-else>{{ user.first_name }} {{ user.last_name }}</div>
  </div>
</template>

<script setup>
import { useUser } from "@/composables/useUser.ts";
import { onMounted } from "vue";

const { user, loadUser } = useUser();

onMounted(() => loadUser())

</script>
