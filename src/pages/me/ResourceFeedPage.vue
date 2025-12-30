<template>
  <div>
    <div v-if="resource && resource.resource_type !== 'jrnl'" class="mt-1 md:w-96 mx-auto">
      <FeedList :interactions-list="contextualResources" />
    </div>
    <div v-else class="mt-10 mx-4 md:w-11/12 md:mx-auto">
      <div v-for="(resourceItem, index) in contextualResources" :key="index" class="mb-6">
        <div v-if="resourceItem.resource">
        <div class="text-lg font-bold mb-2">{{ formatDate(new Date(resourceItem.date)) }} - {{ resourceItem.resource.title }}</div>
        <div class="text-sm dark:text-gray-300 text-gray-700 mb-2">{{ resourceItem.resource.subtitle }}</div>
        <div class="text-sm dark:text-gray-300 text-gray-500 whitespace-pre-line">{{ resourceItem.resource.content }}</div>
        </div>
      </div>
    </div>
  </div></template>
<script setup lang="ts">
import FeedList from '@/components/Feed/FeedList.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { useResource } from '@/composables/useResource'
import { useMenu } from '@/composables/useMenu'
import { type ApiResource, type ContextualResource, type ResourceRelation } from '@/types/models'

const props = defineProps<{
  id: string
}>()

const { getResource, getAuthorInteractionForResource } = useResource()
const { headerValue } = useMenu()

const resource = ref<ApiResource | null>(null)

const { getAllRelationsForResource } = useResourceRelations()
const relations = ref<any[]>([])
const contextualResources = ref<ContextualResource[]>([])

const processRelationsWithAuthorInteractions = async () => {
  const processedResources = await Promise.all(
    relations.value.map(async (targetResource: any) => {
      const relatedResource: ApiResource =
        targetResource.origin_resource_id === props.id
          ? targetResource.target_resource
          : targetResource.origin_resource
      
      let date: Date | string = targetResource.created_at
      try {
        const authorInteraction = await getAuthorInteractionForResource(relatedResource.id)
        if (authorInteraction && authorInteraction.interaction_date) {
          date = authorInteraction.interaction_date
        }
      } catch (error) {
        console.warn(`Could not fetch author interaction for resource ${relatedResource.id}:`, error)
      }
      
      return {
        resource: relatedResource,
        date: date,
        user_id: targetResource.user_id,
        context_comment: targetResource.relation_comment,
        interaction_type: 'bibl',
        progress: null,
        id: targetResource.id,
        ...targetResource
      }
    })
  )
  
  contextualResources.value = processedResources.sort((a: ContextualResource, b: ContextualResource) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
const formatDate = (date: Date) => {
  const formatted = date.toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
onMounted(async () => {
  relations.value = await getAllRelationsForResource(props.id)
  resource.value = await getResource(props.id)
  if (resource.value) {
    headerValue.value = { text: resource.value.title, link: `/resources/${resource.value.id}` }
  }
  await processRelationsWithAuthorInteractions()
})

onUnmounted(() => {
  headerValue.value = null
})
</script>
