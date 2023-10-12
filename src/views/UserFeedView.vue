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
      <ThoughtInputsList class="mx-auto" :thought-inputs="thoughtInputs" />
    </div>
  </div>
</template>
<script setup lang="ts">
import UserInfos from '@/components/UserInfos.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateThoughtInput from '@/components/CreateThoughtInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { ref, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { type ApiInteraction } from '@/types/models'

const props = defineProps<{
  pageUserId: string
}>()

const openNewThoughtInput = ref(false)

const { getUserById, user } = useUser()

const pageUser = ref(null)

const { getUserThoughtInputs } = useThoughtInputs()
const thoughtInputs = ref<ApiInteraction[]>([])

onMounted(async () => {
  pageUser.value = await getUserById(props.pageUserId)
  thoughtInputs.value = await getUserThoughtInputs(props.pageUserId)
})
</script>
