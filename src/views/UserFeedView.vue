<template>
  <div>
    <div class="m-8">
      <UserInfos class="mx-auto border my-8" v-if="pageUser" :user="pageUser" />
      <ToggleButtonGroup
        url-key="interaction_type"
        :choices="[
          { text: 'Biblio', value: 'bibl' },
          { text: 'Productions', value: 'prdc' }
        ]"
        default="bibl"
        url
      />
      <div v-if="tab === 'bibl'">
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
      <div v-if="tab === 'prdc'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(article, i) in thoughtOutputs.map((thoughtOutput) => thoughtOutput.resource)"
            :key="i"
          >
            <ArticleCard
              :title="article.title"
              :subtitle="article.subtitle"
              :image-url="article.image_url"
              :progress="article.interaction_progress"
              :uuid="article.id"
              :author="article.author"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
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

const tab = ref<string>('bibl')
const route = useRoute()
watch(
  () => route.query.interaction_type,
  (newValue) => {
    console.log('new route query', newValue)
    if (typeof newValue === 'string') tab.value = newValue
  }
)

const { getUserThoughtOutputs } = useInteraction()
const thoughtOutputs = ref<ApiInteraction[]>([])

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
  thoughtOutputs.value = await getUserThoughtOutputs(props.pageUserId)
})
</script>
