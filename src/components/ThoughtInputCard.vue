<template>
  <div class="w-full md:w-96">
    <div v-if="contextualResource.context_comment" class="text-xs italic mb-2">
      <div>
        {{ contextualResource.context_comment }}
      </div>
      <div class="flex flex-wrap">
        <router-link
          v-if="contextAuthor"
          :to="'/users/' + contextAuthor.id"
          class="text-2xs underline"
          >{{ contextAuthor.first_name }} {{ contextAuthor.last_name }}</router-link
        >
        <div v-if="contextualResource.date" class="text-2xs italic ml-2">
          {{ formatDate(contextualResource.date) }}
        </div>
        <div v-if="contextualResource.progress" class="ml-auto m-1 w-1/3">
          <ProgressBar :progress-value="contextualResource.progress" />
        </div>
      </div>
    </div>
    <router-link :to="'/resources/' + contextualResource.resource.id + '?tab=ctnt'">
      <div v-if="contextualResource.resource" class="border shadow-lg rounded p-4 md:w-96">
        <div class="flex">
          <img
            v-if="contextualResource.resource"
            class="w-8 h-fit mr-4"
            :src="contextualResource.resource.image_url"
          />
          <div>
            <div>
              {{ contextualResource.resource.title }}
              {{ contextualResource.resource.subtitle }}
            </div>
            <div class="flex flex-wrap w-full" style="margin-top: -8px">
              <router-link
                v-if="resourceAuthor"
                :to="'/users/' + resourceAuthor.id"
                class="text-2xs underline"
                >{{ resourceAuthor.first_name }} {{ resourceAuthor.last_name }}</router-link
              >
            </div>
            <div class="text-2xs">{{ formatText(contextualResource.resource.comment) }}</div>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div v-if="contextualResource.date" class="text-2xs italic">
            {{ formatDate(contextualResource.resourcedate) }}
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import { type ApiInteraction, type User, type ContextualResource } from '@/types/models'
import { useUser } from '@/composables/useUser'
import { useResource } from '@/composables/useResource'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  contextualResource: ContextualResource
}>()

const { getUserById } = useUser()
const { getAuthorInteractionForResource } = useResource()

const resourceAuthor = ref<User | null>(null)
const resourceAuthorInteraction = ref<Interaction | null>(null)
const contextAuthor = ref<User | null>(null)

onMounted(async () => {
  if (props.contextualResource.user_id)
    contextAuthor.value = await getUserById(props.contextualResource.user_id)
  if (props.contextualResource.resource)
    resourceAuthorInteraction.value = await getAuthorInteractionForResource(
      props.contextualResource.resource.id
    )
  if (resourceAuthorInteraction.value)
    resourceAuthor.value = await getUserById(resourceAuthorInteraction.value.interaction_user_id)
})

const formatDate = (date: Date): string => {
  if (!date) return ''
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
