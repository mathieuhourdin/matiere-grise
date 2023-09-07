<template>
  <div class="w-full flex h-12 bg-slate-300 rounded-t border-b border-b-slate-400 shadow">
    <BaseLink class="ml-4 my-auto mr-auto">🫀 Matiere Grise</BaseLink>
    <router-link class="my-auto mr-4" to="/platform-presentation">A Propos</router-link>
    <UserManagement class="mr-4 my-auto" />
  </div>
</template>

<script setup>

import UserManagement from "@/components/UserManagement.vue";
import BaseLink from "@/components/Ui/BaseLink.vue";

</script>
