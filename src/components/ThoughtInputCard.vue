<template>
  <div class="w-full md:w-96">
    <div v-if="usageReason" class="text-xs italic mb-2">
      {{ usageReason }}
    </div>
    <div class="border shadow-lg rounded p-4 md:w-96">
      <div class="flex">
        <img v-if="thoughtInput.resource" class="w-8 h-fit mr-4" :src="thoughtInput.resource.image_url" />
        <div>
          <div>
            <router-link :to="'/thought_inputs/' + thoughtInput.id">
              {{ thoughtInput.resource.title }}</router-link
            >
          </div>
          <div class="flex flex-wrap w-full" style="margin-top: -8px">
            <div class="text-2xs italic">
              Nom de l'auteur 
            </div>
            <div class="ml-auto m-1 w-1/3">
              <ProgressBar :progress-value="thoughtInput.interaction_progress" />
            </div>
          </div>
          <div class="text-2xs">{{ formatText(thoughtInput.interaction_comment) }}</div>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div v-if="thoughtInput.interaction_date" class="text-2xs italic">
          {{ formatDate(thoughtInput.interaction_date) }}
        </div>
        <router-link
          v-if="inputAuthor"
          :to="'/users/' + inputAuthor.id"
          class="ml-auto text-2xs underline"
          >{{ inputAuthor.first_name }} {{ inputAuthor.last_name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { type ApiInteraction, type User } from '@/types/models'
import { useUser } from '@/composables/useUser'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  thoughtInput: ApiInteraction,
  usageReason?: string
}>()

const { getUserById } = useUser()
const inputAuthor = ref<User | null>(null)

onMounted(async () => {
  if (props.thoughtInput.interaction_user_id) inputAuthor.value = await getUserById(props.thoughtInput.interaction_user_id)
})

const formatDate = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}
const formatText = (text: string): string => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}
</script>
