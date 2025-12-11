<template>
  <div class="py-12 w-11/12 mx-auto">
    <h1 class="text-xl">Choisissez un mentor</h1>
    <ActionButton @click="next" type="valid" text="Valider" class="m-2 mb-6 w-24 ml-auto" />
    <ListComponent class="w-full mt-6" :items="mentors" :columns="columns" :display-header="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListComponent from '@/components/Ui/ListComponent.vue'
import { type ApiResource } from '@/types/models'
import { useUser } from '@/composables/useUser'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const { getUsers } = useUser()

const mentors = ref<ApiResource[]>([])

const columns = ref<{ display_name: string, field_name: string[], field_type: string }[]>([
  { display_name: 'Image', field_name: ['profile_picture_url'], field_type: 'image' },
  { display_name: 'Nom', field_name: ['display_name', 'description'], field_type: 'text' },
  { display_name: 'Action', field_name: ['action'], field_type: 'action' }
])

const next = () => {
  router.push('/feed')
}

onMounted(async () => {
  const users = await getUsers()
  mentors.value = users.filter((user) => user.is_platform_user == false && user.profile_picture_url).map((user) => ({
    id: user.id,
    profile_picture_url: user.profile_picture_url,
    display_name: user.display_name,
    description: user.biography.slice(0, 100) + '...',
    action: 'Choisir'
  }))
})
</script>