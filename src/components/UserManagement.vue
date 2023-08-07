<template>
  <div>
    <a v-if="!isUserLoaded || !user" href="/login">Login</a>
    <div v-else>{{ user.first_name }} {{ user.last_name }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const isUserLoaded = computed(() => {
  const userIdStored = localStorage.getItem("userId");
  return !!userIdStored;
})

const userId = computed(() => {
  return localStorage.getItem("userId");
})

const user = ref(null);

const loadUser = async () => {
  if (!isUserLoaded.value) return null;
  const response = await fetch("http://127.0.0.1:8080/users/" + userId.value);
  const responseJson = await response.json();
  user.value = responseJson;
}

onMounted(() => loadUser())

</script>
