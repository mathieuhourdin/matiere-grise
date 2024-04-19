<template>
  <div class="mt-1 md:w-96 mx-auto">
    <FeedList :interactions-list="contextualResources" />
  </div>
</template>
<script setup lang="ts">
import FeedList from '@/components/Feed/FeedList.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { useResource } from '@/composables/useResource'
import { useMenu } from '@/composables/useMenu'
import { type ApiRelations, type Resource, type ContextualResource } from '@/types/models'

const props = defineProps<{
  id: string
}>()

const { getResource } = useResource()
const { headerValue } = useMenu()

const resource = ref<Resource>(null)

const { getAllRelationsForResource } = useResourceRelations()
const relations = ref<ApiInteraction[]>([])
const contextualResources = computed(() => {
  return relations.value
    .map((targetResource) => {
      console.log('Resource : ', targetResource)
      return {
        resource:
          targetResource.origin_resource_id === props.id
            ? targetResource.target_resource
            : targetResource.origin_resource,
        date: targetResource.created_at,
        user_id: targetResource.user_id,
        context_comment: targetResource.relation_comment,
        progress: null,
        ...targetResource
      }
    })
    .sort((a, b) => 0.5 - Math.random())
})

onMounted(async () => {
  relations.value = await getAllRelationsForResource(props.id)
  resource.value = await getResource(props.id)
  headerValue.value = { text: resource.value.title, link: `/resources/${resource.value.id}` }
})

onUnmounted(() => {
  headerValue.value = null
})
</script>
