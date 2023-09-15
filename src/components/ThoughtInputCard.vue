<template>
  <div class="border shadow-xl rounded m-2 p-4 w-96">
    <div class="flex">
      <img class="w-8 h-fit mr-4" :src="thoughtInput.resource_image_link" />
      <div>
        <div>{{ thoughtInput.resource_title }}</div>
        <div class="flex flex-wrap w-full" style="margin-top: -8px">
          <div class="text-2xs italic">
            {{ thoughtInput.resource_author_name }}
          </div>
          <div class="ml-auto m-1 w-1/3">
            <ProgressBar :progress-value="thoughtInput.input_progress" />
          </div>
        </div>
        <div class="text-2xs">{{ formatText(thoughtInput.input_comment) }}</div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div v-if="thoughtInput.input_date" class="text-2xs italic">
        {{ formatDate(thoughtInput.input_date) }}
      </div>
      <router-link
        v-if="inputAuthor"
        :to="'/users/' + inputAuthor.id"
        class="ml-auto text-2xs underline"
        >{{ inputAuthor.first_name }} {{ inputAuthor.last_name }}</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { ThoughtInput } from '@/composables/useThoughtInputs.ts'
import { useUser } from '@/composables/useUser.ts'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  thoughtInput: ThoughtInput
}>()

const { getUserById } = useUser()
const inputAuthor = ref(null)
onMounted(async () => (inputAuthor.value = await getUserById(props.thoughtInput.input_user_id)))

const formatDate = (date: Date) => {
  return date.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}
const formatText = (text) => {
  return text.length > 200 ? text.slice(0, 150) + '...' : text
}
</script>
