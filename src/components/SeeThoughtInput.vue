<template>
  <div>
    <div>
      <img
        :src="thoughtInput.resource_image_link"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
        style="max-height: 10rem"
      />
    </div>
    <h1 class="text-3xl my-3 font-mplus md:text-center text-left">
      {{ thoughtInput.resource_title }}
    </h1>
    <div class="text-center">
      <span class="md:text-center text-left">{{ thoughtInput.resource_author_name }}</span>
      <span v-if="inputUser"> lu par {{ inputUser.first_name }} {{ inputUser.last_name }}</span>
    </div>
    <div class="md:flex my-8">
      <ProgressBar :progress-value="thoughtInput.input_progress" class="m-2 w-1/3" />
      <a class="ml-auto underline" :href="thoughtInput.resource_link"> ressource externe</a>
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <div class="text-xs">Description de l'oeuvre</div>
    <TextInterface
      class="border text-sm"
      :full-text="thoughtInput.resource_comment"
      :editable="isThoughtInputAuthor"
    />
    <hr class="border-top border-zinc-400 my-4" />
    <div class="text-xs">Pourquoi la lire</div>
    <TextInterface
      class="border text-sm"
      :full-text="thoughtInput.input_comment"
      :editable="isThoughtInputAuthor"
    />
  </div>
</template>

<script setup lang="ts">
import TextInterface from '@/components/TextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useUser } from '@/composables/useUser'
import { type ThoughtInput, type User } from '@/types/models'
import { ref, computed, onMounted } from 'vue'

const { getUserById, user } = useUser()

const props = defineProps<{
  thoughtInput: ThoughtInput
}>()

const inputUser = ref<User | null>(null)

const isThoughtInputAuthor = computed(() => {
  return user.value ? props.thoughtInput.input_user_id === user.value.id : false
})

onMounted(async () => {
  if (props.thoughtInput.input_user_id)
    inputUser.value = await getUserById(props.thoughtInput.input_user_id)
})
</script>
