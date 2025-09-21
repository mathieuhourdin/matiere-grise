<template>
  <div class="bg-slate-200 dark:bg-gray-800 z-10 border-r border-slate-400 dark:border-gray-600 transition-colors duration-200">
    <div>
      <MenuItem
        v-if="user"
        :to="'/users/' + user.id"
        title="Mon profil"
        subtitle="Informations personnelles"
      />
      <MenuItem to="/feed" title="Fil d'actu" subtitle="Les travaux de vos amis" />
      <!--<MenuItem to="/problems" title="Problématiques" subtitle="Carrefours des réflexions" />-->
      <!--<MenuItem to="/productions" title="Productions" subtitle="Internes à la plateforme" />-->
      <!--<MenuItem to="/resources" title="Ressources" subtitle="Externes à la plateforme" />-->
      <!--<MenuItem to="/thought_inputs" title="Bibliographies" subtitle="Lues par les utilisateurs" />-->
      <!--<MenuItem to="/friends" title="Utilisateurs" subtitle="Amis etc" />-->
      <MenuItem to="/create-resource" title="Créer" subtitle="Du nouveau contenu" />
      <MenuItem to="/platform-presentation" title="A propos" subtitle="Présentation de la plateforme" />
      <DarkModeMenuItem />
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/App/MenuItem.vue'
import DarkModeMenuItem from '@/components/App/DarkModeMenuItem.vue'
import { useUser } from '@/composables/useUser'
import { useResource } from '@/composables/useResource'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useUser()

const { getResources, createResource, newResource } = useResource()
const createDraftResourceAndRedirect = async () => {
  const resource = newResource()
  const createdResource = await createResource(resource)
  router.push({ path: '/resources/' + createdResource.id, query: { editing: 'true' } })
}
</script>
