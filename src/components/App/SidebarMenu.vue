<template>
  <div class="bg-slate-200 z-10">
    <div>
      <MenuItem v-if="user" :to="'/users/' + user.id" title="Mon profil" />
      <MenuItem to="/problems" title="Chantiers" subtitle="Carrefours des réflexions"/>
      <MenuItem to="/productions" title="Productions" subtitle="Internes à la plateforme" />
      <MenuItem to="/resources" title="Ressources" subtitle="Externes à la plateforme" />
      <MenuItem to="/thought_inputs" title="Bibliographies" subtitle="Lues par les utilisateurs" />
      <MenuItem to="/friends" title="Utilisateurs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/App/MenuItem.vue'
import { useUser } from '@/composables/useUser'

const { user } = useUser()
</script>
