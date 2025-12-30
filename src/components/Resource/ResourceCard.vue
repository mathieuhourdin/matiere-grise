<template>
  <div class="text-center mb-4">
    <router-link :to="articleLink">
      <img
        :src="imageUrl"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/1] object-cover object-center w-full"
        fit="cover"
        position="center"
      />
      <div class="flex">
        <ProgressBar v-if="resourceInteraction" :progress-value="resourceInteraction.interaction_progress" class="m-2 w-1/3 mr-auto" />
        <router-link v-if="resourceAuthor" class="text-xs italic my-auto mr-2" :to="'/social/users/' + resourceAuthor.id"
          >{{ resourceAuthor.first_name }} {{ resourceAuthor.last_name }}</router-link
        >
      </div>
      <div class="mt-3 text-xl font-bold">{{ title }}</div>
      <div class="opacity-70">{{ subtitle }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { useResource } from '@/composables/useResource'
import { useUser } from '@/composables/useUser'
import { computed, ref, onMounted } from 'vue'
import { type User } from '@/types/models'
const props = defineProps<{
  uuid?: string
  title: string
  subtitle: string
  imageUrl: string
  progress?: number
  author?: User
}>()
const { getUserById } = useUser()
const {  getAuthorInteractionForResource } = useResource()
const resourceInteraction = ref<Interaction>(null)
const resourceAuthor = ref<User>(null)

onMounted(async () => {
  resourceInteraction.value = await getAuthorInteractionForResource(props.uuid)
  resourceAuthor.value = await getUserById(resourceInteraction.value.interaction_user_id)
})

const articleLink = computed(() => {
  if (!props.uuid) return ''
  return '/app/resources/' + props.uuid
})
</script>
