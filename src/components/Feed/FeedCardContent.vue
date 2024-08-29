<template>
  <div>
    <FeedCardTextInterface
      v-if="interaction.interaction_type != 'inpt'"
      :interaction="interaction"
    />
    <div v-else class="h-96" style="height: 500px">
      <FeedCard
        v-if="resourceAuthorInteraction"
        class="overflow-auto"
        :interaction="resourceAuthorInteraction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FeedCard from '@/components/Feed/FeedCard.vue'
import FeedCardTextInterface from '@/components/Feed/FeedCardTextInterface.vue'
import { type Interaction } from '@/types/models'
import { useResource } from '@/composables/useResource'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  interaction: any
}>()
const { getAuthorInteractionForResource } = useResource()
const resourceAuthorInteraction = ref(null)

onMounted(async () => {
  const authorInteraction = await getAuthorInteractionForResource(props.interaction.resource.id)
  if (authorInteraction) {
    authorInteraction.resource = props.interaction.resource
    authorInteraction.user_id = authorInteraction.interaction_user_id
    resourceAuthorInteraction.value = authorInteraction
  }
})
</script>
