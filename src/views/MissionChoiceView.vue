<template>
  <div class="py-12 w-11/12 mx-auto">
    <h1 class="text-xl">Choisissez une mission</h1>
    <span class="text-sm text-gray-400">Seuls ceux qui sont assez fous pour penser qu’ils peuvent changer le monde, y parviennent.</span>
    <ListComponent class="w-full mt-6" :items="missions" :columns="columns" :display-header="false" />
    <ActionButton @click="next" type="valid" text="Valider" class="m-2" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListComponent from '@/components/Ui/ListComponent.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useResource } from '@/composables/useResource'
import { type ApiResource } from '@/types/models'
import { useRouter } from 'vue-router'
const router = useRouter()

const { getResources } = useResource()

const missions = ref<ApiResource[]>([])

const columns = ref<{ display_name: string, field_name: string[], field_type: string }[]>([
  { display_name: 'Image', field_name: ['image_url'], field_type: 'image' },
  { display_name: 'Titre', field_name: ['title', 'subtitle'], field_type: 'text' },
  { display_name: 'Action', field_name: ['action'], field_type: 'action' }
])

const next = () => {
  router.push('/mentor-choice')
}

onMounted(async () => {
  missions.value = await getResources({ resource_type: 'miss' })
})
</script>