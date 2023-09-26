<template>
  <div class="bg-slate-200 z-10">
    <div>
      <MenuItem v-if="user" :to="'/users/' + user.id">Mon profil</MenuItem>
      <MenuItem to="/problems">Problématiques</MenuItem>
      <MenuItem to="/">Productions</MenuItem>
      <MenuItem to="/thought_inputs">Inspirations</MenuItem>
      <MenuItem to="/friends">Amis</MenuItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import { useUser } from '@/composables/useUser'

const { user } = useUser()
</script>
