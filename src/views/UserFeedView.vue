<template>
  <div>
    <div class="m-8">
      <UserInfos class="mx-auto border my-8" v-if="pageUser" :user="pageUser" />
      <div class="text-center m-4 italic text-sm">Derniers apports extérieurs</div>

      <div
        v-if="user && pageUserId == user.id"
        class="italic underline text-xs"
        @click="openNewThoughtInput = true"
      >
        Ajouter un nouvel apport
      </div>
      <ModalSheet :open="openNewThoughtInput">
        <CreateThoughtInput @close="openNewThoughtInput = false" />
      </ModalSheet>
      <ThoughtInputsList class="mx-auto" :contextual-resources="contextualResources" />
    </div>
  </div>
</template>
<script setup lang="ts">
import UserInfos from '@/components/UserInfos.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateThoughtInput from '@/components/CreateThoughtInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { type ApiInteraction, type ContextualResource } from '@/types/models'

const props = defineProps<{
  pageUserId: string
}>()

const openNewThoughtInput = ref(false)

const { getUserById, user } = useUser()

const pageUser = ref(null)

const { getUserThoughtInputs } = useThoughtInputs()
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

onMounted(async () => {
  pageUser.value = await getUserById(props.pageUserId)
  thoughtInputs.value = await getUserThoughtInputs(props.pageUserId)
})
</script>
