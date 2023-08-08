<template>
  <div>
    <BaseLink v-if="!isUserLoaded || !user" partial-href="login">Login</BaseLink>
    <div v-else>{{ user.first_name }} {{ user.last_name }}</div>
  </div>
</template>

<script setup>
import BaseLink from "@/components/Ui/BaseLink.vue";
import { ref, computed, onMounted } from "vue";
import { fetchWrapper } from "@/helpers";

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
  const response = await fetchWrapper.get("/users/" + userId.value);
  user.value = response;
}

onMounted(() => loadUser())

</script>
