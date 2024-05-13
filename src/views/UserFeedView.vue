<template>
  <div>
    <div class="mt-8 md:mx-6">
      <UserInfos class="mx-auto border my-8" v-if="pageUser" :user="pageUser" />
      <div
        v-if="user && pageUserId == user.id"
        class="italic underline text-xs mb-4"
        @click="openNewThoughtInput = true"
      >
        Ajouter un nouvel apport
      </div>
      <ModalSheet :open="openNewThoughtInput">
        <CreateThoughtInput @close="openNewThoughtInput = false" />
      </ModalSheet>
      <FeedList :interactions-list="contextualInteractions" />
    </div>
  </div>
</template>
<script setup lang="ts">
import FeedList from '@/components/Feed/FeedList.vue'
import UserInfos from '@/components/User/UserInfos.vue'
import ArticleCard from '@/components/Article/ArticleCard.vue'
import ToggleButtonGroup from '@/components/Ui/ToggleButtonGroup.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateThoughtInput from '@/components/ThoughtInput/CreateThoughtInput.vue'
import ThoughtInputsList from '@/components/ThoughtInput/ThoughtInputsList.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { useInteraction } from '@/composables/useInteraction'
import { type ApiInteraction, type ContextualResource } from '@/types/models'

const props = defineProps<{
  pageUserId: string
}>()

const openNewThoughtInput = ref(false)

const { getUserById, user } = useUser()

const pageUser = ref(null)

const { getUserReadAndWriteInteractions, getInteractions } = useInteraction()
const interactions = ref<ApiInteraction[]>([])
const contextualInteractions = computed(() => {
  return interactions.value
    .map((interaction) => {
      return {
        resource: interaction.resource,
        date: interaction.interaction_date,
        user_id: interaction.interaction_user_id,
        context_comment: interaction.interaction_comment,
        progress: interaction.interaction_progress,
        ...interaction
      }
    })
    .sort((a, b) => b.date - a.date)
})

onMounted(async () => {
  pageUser.value = await getUserById(props.pageUserId)
  interactions.value = await getUserReadAndWriteInteractions(props.pageUserId)
  const reviews = await getInteractions("rvew")
  interactions.value = interactions.value.concat(reviews)
})
</script>
