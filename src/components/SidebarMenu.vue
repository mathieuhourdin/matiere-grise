<template>
  <div class="bg-slate-200">
    <div>
      <MenuItem v-if="user" :to="'/users/' + user.id">Mon profil</MenuItem>
      <MenuItem to="/">Productions</MenuItem>
      <MenuItem to="/problematics">Problématiques</MenuItem>
      <MenuItem to="/thought-inputs">Inspirations</MenuItem>
      <MenuItem to="/friends">Amis</MenuItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import { useUser } from '@/composables/useUser.ts'

const { user } = useUser()
</script>
