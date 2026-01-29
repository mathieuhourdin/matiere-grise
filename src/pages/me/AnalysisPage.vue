<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <div v-if="!resource" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else>
      <!-- Display the analysis resource -->
      <div class="mb-8">
        <div class="flex justify-between items-start mb-2">
          <div class="text-lg font-bold">{{ formatDate(resource.created_at) }} - {{ resource.title }}</div>
          <ActionButton type="abort" size="sm" @click="handleDelete">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </ActionButton>
        </div>
        <div class="text-sm dark:text-gray-300 text-gray-700 mb-2">{{ resource.subtitle }}</div>
        <div class="text-sm dark:text-gray-300 text-gray-500 whitespace-pre-line">{{ resource.content }}</div>
      </div>


      <div class="mb-8">Last analysis</div>
      <div v-for="(analysis, index) in filterResourcesByType(contextualResources, 'anly')" :key="index" class="mb-6">
        <JournalItem :resourceItem="analysis" />
      </div>
      
      <!-- Display all resource relations -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Related Resources</h2>
        <div class="mt-10 mx-4 md:w-11/12 md:mx-auto">
          <!-- Display tasks -->
          <h3 class="text-xl font-bold mb-4">Tasks</h3>
          <div v-for="(task, index) in filterResourcesByType(contextualResources, 'task')" :key="index" class="mb-6">
            <JournalItem :resourceItem="task" />
          </div>
          <!-- Display questions -->
          <h3 class="text-xl font-bold mb-4">Questions</h3>
          <div v-for="(question, index) in filterResourcesByType(contextualResources, 'qest')" :key="index" class="mb-6">
            <JournalItem :resourceItem="question" />
          </div>
          <!-- Display deliverables -->
          <h3 class="text-xl font-bold mb-4">Deliverables</h3>
          <div v-for="(deliverable, index) in filterResourcesByType(contextualResources, 'dlvr')" :key="index" class="mb-6">
            <JournalItem :resourceItem="deliverable" />
          </div>
          <!-- Display resources -->
          <h3 class="text-xl font-bold mb-4">Resources</h3>
          <div v-for="(resource, index) in filterResourcesByType(contextualResources, 'rsrc')" :key="index" class="mb-6">
            <JournalItem :resourceItem="resource" />
          </div>
          <!-- Display events-->
          <div class="text-xl font-bold mb-4">Elements simples</div>
          <div v-for="(event, index) in filterResourcesByType(contextualResources, 'evnt')" :key="index" class="mb-6">
            <JournalItem :resourceItem="event" />
          </div>
          <!-- Display traces -->
          <h3 class="text-xl font-bold mb-4">Traces</h3>
          <div v-for="(event, index) in filterResourcesByType(contextualResources, 'trce')" :key="index" class="mb-6">
            <JournalItem :resourceItem="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JournalItem from '@/components/Journal/JournalItem.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { useResource } from '@/composables/useResource'
import { useMenu } from '@/composables/useMenu'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import { type ApiResource, type ContextualResource } from '@/types/models'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { getResource, getAuthorInteractionForResource } = useResource()
const { headerValue } = useMenu()
const { deleteAnalysis } = useUser()
const { launchSnackbar } = useSnackbar()

const resource = ref<ApiResource | null>(null)
const { getAllRelationsForResource } = useResourceRelations()
const relations = ref<any[]>([])
const contextualResources = ref<ContextualResource[]>([])
const isDeleting = ref(false)

const processRelationsWithAuthorInteractions = async () => {
  const processedResources = await Promise.all(
    relations.value.map(async (targetResource: any) => {
      const relatedResource: ApiResource =
        targetResource.origin_resource_id === props.id
          ? targetResource.target_resource
          : targetResource.origin_resource
      
      let interactionDate: Date | string = targetResource.created_at
      try {
        const authorInteraction = await getAuthorInteractionForResource(relatedResource.id)
        if (authorInteraction && authorInteraction.interaction_date) {
          interactionDate = authorInteraction.interaction_date
        }
      } catch (error) {
        console.warn(`Could not fetch author interaction for resource ${relatedResource.id}:`, error)
      }
      
      return {
        resource: relatedResource,
        date: interactionDate,
        interaction_date: interactionDate,
        user_id: targetResource.user_id,
        interaction_user_id: targetResource.user_id,
        context_comment: targetResource.relation_comment,
        interaction_comment: targetResource.relation_comment,
        interaction_type: 'bibl',
        interaction_progress: null,
        progress: null,
        id: targetResource.id,
        ...targetResource
      }
    })
  )
  
  contextualResources.value = processedResources.sort((a: any, b: any) => {
    const dateA = a.interaction_date || a.date
    const dateB = b.interaction_date || b.date
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

const filterResourcesByType = (resources: any[], type: string) => {
  return resources.filter((resource: any) => resource.resource.resource_type === type)
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleDelete = async () => {
  if (!resource.value?.id || isDeleting.value) return
  
  const confirmed = window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')
  if (!confirmed) return

  try {
    isDeleting.value = true
    await deleteAnalysis(resource.value.id)
    launchSnackbar('Analysis deleted successfully', 'success')
    router.push('/me/home')
  } catch (error) {
    console.error('Error deleting analysis:', error)
    // Error message is already shown by deleteAnalysis function
    isDeleting.value = false
  }
}
onMounted(async () => {
  resource.value = await getResource(props.id)
  
  // Verify it's an analysis resource
  if (resource.value && resource.value.resource_type !== 'anly') {
    console.warn(`Resource ${props.id} is not of type 'anly', it is '${resource.value.resource_type}'`)
  }
  
  if (resource.value) {
    headerValue.value = { text: resource.value.title, link: `/me/analysis/${resource.value.id}` }
  }
  
  // Load and process relations
  relations.value = await getAllRelationsForResource(props.id)
  await processRelationsWithAuthorInteractions()
})

onUnmounted(() => {
  headerValue.value = null
})
</script>

