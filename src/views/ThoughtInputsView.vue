<template>
  <div class="m-4">
    <div>Derniers apports</div>
    <div v-if="user" class="italic underline text-xs" @click="openNewThoughtInput = true">
      Ajouter un nouvel apport
    </div>
    <ModalSheet :open="openNewThoughtInput" @close="openNewThoughtInput = false">
      <CreateThoughtInput @refresh="loadThoughtInputs" @close="openNewThoughtInput = false" />
    </ModalSheet>
    <ThoughtInputsList class="mt-10" :contextual-resources="contextualResources" />
  </div>
</template>

<script setup lang="ts">
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateThoughtInput from '@/components/ThoughtInput/CreateThoughtInput.vue'
import ThoughtInputsList from '@/components/ThoughtInput/ThoughtInputsList.vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { useUser } from '@/composables/useUser'
import { type ApiInteraction } from '@/types/models'
import { ref, computed, onMounted } from 'vue'

const openNewThoughtInput = ref(false)

const { getThoughtInputs } = useThoughtInputs()
const { user } = useUser()

const thoughtInputs = ref<ApiInteraction[]>([])

const contextualResources = computed(() => {
  return thoughtInputs.value.map((thoughtInput) => {
    return {
      resource: thoughtInput.resource,
      date: thoughtInput.interaction_date,
      user_id: thoughtInput.interaction_user_id,
      context_comment: thoughtInput.interaction_comment,
      progress: thoughtInput.interaction_progress
    }
  })
})

const loadThoughtInputs = async () => (thoughtInputs.value = await getThoughtInputs())

onMounted(async () => {
  await loadThoughtInputs()
})
</script>
