<template>
  <div>
    <div v-if="!resourceIsLoaded" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else>
      <div v-if="!editingMetaData">
        <div class="my-8">
          <img
            :src="resource.image_url"
            class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
            style="max-height: 20rem"
          />
        </div>
        <h1 class="text-3xl my-3 font-mplus md:text-center text-left">
          {{ resource.title }}
        </h1>
        <div class="md:text-center text-left">{{ resource.subtitle }}</div>
        <div class="md:text-center text-left">
          <router-link
            v-if="resourceUser"
            :to="'/users/' + resourceUser.id"
            class="text-sm underline"
            >{{ resourceUser.first_name }} {{ resourceUser.last_name }}</router-link
          >
          <DateField v-if="authorInteraction" :date="authorInteraction.interaction_date" />
        </div>
        <div class="md:flex my-8">
          <ProgressBar
            v-if="authorInteraction"
            :progress-value="authorInteraction.interaction_progress"
            class="m-2 w-1/3"
          />
          <a
            v-if="resource.external_content_url"
            class="ml-auto underline"
            :href="resource.external_content_url"
            target="_blank"
          >
            Lien ressource externe
          </a>
        </div>
      </div>
      <div v-else class="my-2 flex flex-col">
        <ResourceForm
          :article="resource"
          class=""
          @change="(event) => debouncedUpdateResource(resource.id, event)"
        />
        <ResourceAuthorPicker
          class="my-2"
          :interaction="authorInteraction"
          :resource-id="resourceId"
          @change="fetchAuthorInteraction"
        />
        <div class="flex flex-row-reverse mb-4">
          <ActionButton class="ml-2" @click="setEditingMetaData(false)" type="valid" text="Preview"
            >Ok</ActionButton
          >
          <ActionButton
            class="ml-2"
            v-if="authorInteraction && !authorInteraction.interaction_is_public"
            @click="publishInteraction"
            type="valid"
            text="Publier"
          />
          <ActionButton
            class="ml-2"
            v-else-if="authorInteraction"
            @click="unpublishInteraction"
            type="abort"
            text="Dépublier"
          />
          <ActionButton
            class="ml-2"
            @click="isTextInterface = !isTextInterface"
            type="valid"
            :text="isTextInterface ? 'Text brut' : 'Editeur'"
          />
        </div>
      </div>
      <div>
        <ToggleButtonGroup
          v-if="!editingMetaData"
          :choices="tabChoices"
          :default="toggleDefault"
          :url-key="urlParam"
          url
        />
      </div>
      <hr class="border-top border-zinc-400 my-4" />
      <div v-if="current_tab == 'ctnt'">
        <!--<div class="text-xs italic">Commentaire</div>
        <SelectionTextInterface
          :text="resource.comment"
          :editable="isResourceEditable"
          v-if="resource.publishing_state != 'drft'"
          @change="(event) => debouncedUpdateResourceComment(event)"
        />
        <TextAreaInput
          v-else
          class="h-20"
          label="Commentaire"
          :modelValue="resource.comment"
          @update:modelValue="(event) => debouncedUpdateResourceComment(event)"
        />
        <hr class="border-top border-zinc-400 my-4" />-->
        <div class="text-xs italic">Contenu</div>
        <TextAreaInput
          v-if="displayTextInterface"
          class="mt-4 h-96"
          :modelValue="resource.content"
          @update:modelValue="(event) => debouncedUpdateResourceContent(event)"
        />
        <SelectionTextInterface
          class="min-h-fit"
          v-else
          :ext-comments="comments"
          :resource-id="resource.id"
          :text="resource.content"
          :editable="isResourceEditable"
          @change="(event) => debouncedUpdateResourceContent(event)"
        />
        <CommentsThread class="mt-6" :resource-id="resourceId" />
      </div>
      <div v-else-if="current_tab == 'bbli'">
        <ModalSheet
          :open="openAddResourceRelationAsTarget"
          @close="openAddResourceRelationAsTarget = false"
        >
          <CreateResourceRelationForm
            @refresh="loadBiblio"
            @close="openAddResourceRelationAsTarget = false"
            :target-resource="resource"
          />
        </ModalSheet>
        <div @click="openAddResourceRelationAsTarget = true" class="text-sm italic underline">
          Ajouter une référence
        </div>
        <ThoughtInputsList :contextual-resources="contextualResources" />
      </div>
      <div v-else-if="current_tab == 'pblm'">
        <ThoughtInputsList :contextual-resources="contextualResourcesUsages" />
      </div>
      <div v-else-if="current_tab == 'inpt'">
        <ThoughtInputsList :contextual-resources="contextualResourcesInteractions" />
      </div>
      <ResourceTools
        class="fixed right-3 bottom-5"
        :resource="resource"
        :is-resource-editable="isResourceEditable"
        @refresh="loadUsages() && loadInteractions()"
        @edit="setEditingMetaData(true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceTools from '@/components/Resource/ResourceTools.vue'
import CreateResourceRelationForm from '@/components/Resource/CreateResourceRelationForm.vue'
import CommentsThread from '@/components/Comment/CommentsThread.vue'
import DateField from '@/components/Ui/DateField.vue'
import ToggleButtonGroup from '@/components/Ui/ToggleButtonGroup.vue'
import SelectionTextInterface from '@/components/SelectionTextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ResourceForm from '@/components/Resource/ResourceForm.vue'
import ResourceAuthorPicker from '@/components/Resource/ResourceAuthorPicker.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ThoughtInputsList from '@/components/ThoughtInput/ThoughtInputsList.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import { useResource } from '@/composables/useResource'
import { useInteraction } from '@/composables/useInteraction'
import { useComments } from '@/composables/useComments'
import { useUser } from '@/composables/useUser'
import { useMenu } from '@/composables/useMenu'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { watch, toRefs, ref, computed, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  type User,
  type Resource,
  type Interaction,
  type ResourceRelation,
  type ApiResource,
  type Comment
} from '@/types/models'
const props = defineProps<{
  resourceId: string
  secondLevel?: boolean
}>()
const route = useRoute()

/************** tabs ******************/

const displayTextInterface = computed(() => {
  return (
    (isMobile.value && editingMetaData.value) ||
    !resourceIsLoaded.value ||
    resource.value.is_local_draft ||
    !isTextInterface.value
  )
})
const urlParam = computed(() => {
  if (props.secondLevel) {
    return 'popup_tab'
  } else {
    return 'tab'
  }
})

const tabChoices = computed(() => {
  return [
    { text: 'Contenu', value: 'ctnt' },
    { text: 'Biblio', value: 'bbli', count: resourceRelations.value.length },
    { text: 'Sujets', value: 'pblm', count: targetResources.value.length },
    { text: 'Interactions', value: 'inpt', count: interactions.value.length }
  ]
})

const isTextInterface = ref<boolean>(true)
const toggleDefault = ref(
  route.query[urlParam.value] && typeof route.query[urlParam.value] === 'string'
    ? route.query[urlParam.value]
    : 'ctnt'
)

const current_tab = ref<string | null>(route.query[urlParam.value])

watch(
  () => route.query[urlParam.value],
  (newValue) => {
    console.log('new route query', newValue)
    if (typeof newValue === 'string') current_tab.value = newValue
  }
)

/************** Biblio *****************/

const { getResourceRelationsForResource, getUsagesForResource } = useResourceRelations()

const resourceRelations = ref([])
const openAddResourceRelationAsTarget = ref(false)

const loadBiblio = async () => {
  resourceRelations.value = await getResourceRelationsForResource(toRefs(props).resourceId.value)
}

const contextualResources = computed(() => {
  return resourceRelations.value.map((resourceRelation) => {
    return {
      resource: resourceRelation.origin_resource,
      date: resourceRelation.created_at,
      user_id: resourceRelation.user_id,
      context_comment: resourceRelation.relation_comment,
      progress: null
    }
  })
})

/************** interactions *****************/

const interactions = ref<Interaction[]>([])

const { getInteractionsForResource, updateInteraction } = useInteraction()

const loadInteractions = async () => {
  interactions.value = await getInteractionsForResource(props.resourceId)
}

const contextualResourcesInteractions = computed(() => {
  return interactions.value.map((interaction) => {
    return {
      resource: null,
      date: interaction.interaction_date,
      user_id: interaction.interaction_user_id,
      context_comment: interaction.interaction_comment,
      progress: interaction.interaction_progress
    }
  })
})

/************** target resources ***********/

const targetResources = ref<ResourceRelation[]>([])

const loadUsages = async () => {
  targetResources.value = await getUsagesForResource(props.resourceId)
}

const contextualResourcesUsages = computed(() => {
  return targetResources.value.map((targetResource) => {
    return {
      resource: targetResource.target_resource,
      date: targetResource.created_at,
      user_id: targetResource.user_id,
      context_comment: targetResource.relation_comment,
      progress: null
    }
  })
})

/************** resource section ******************/
const resourceIsLoaded = ref<boolean>(false)
const { newResource, getResource, updateResource, getAuthorInteractionForResource } = useResource()
const debouncedUpdate = ref<number | null>(null)
const resource: Ref<ApiResource> = ref<ApiResource>(newResource())
const router = useRouter()
watch(
  () => route.query.editing,
  (editing) => {
    console.log('Editing : ', editing)
    editingMetaData.value = editing === 'false' ? false : !!editing
  }
)
const editingMetaData = ref(false)

const { isMobile } = useMenu()
const setEditingMetaData = (value: boolean) => {
  router.push({ query: { editing: value.toString() } })
}

const debouncedUpdateResource = (id: string, newResource: ApiResource) => {
  resource.value = newResource
  if (debouncedUpdate.value !== null) clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    try {
      await updateResource(id, resource.value)
    } catch (error) {
      console.log('An error : ', error)
    }
  }, 1000)
}

const debouncedUpdateResourceContent = (newResourceContent: string) => {
  //console.log("New resource content : ", newResourceContent)
  if (newResourceContent == '\n') return
  debouncedUpdateResource(toRefs(props).resourceId.value, {
    ...resource.value,
    content: newResourceContent
  })
}
const debouncedUpdateResourceComment = (newResourceComment: string) => {
  if (newResourceComment == '\n') return
  debouncedUpdateResource(toRefs(props).resourceId.value, {
    ...resource.value,
    comment: newResourceComment
  })
}

/************** user section *********************/
const { user, getUserById } = useUser()
const isResourceEditable = computed(() => {
  if (resource.value.is_external) return true
  if (!user.value) return false
  if (!resourceUser.value) return true
  return resourceUser.value.id == user.value.id
})

const resourceUser: Ref<User | null> = ref<User | null>(null)

/************** interactions section *************/

const authorInteraction = ref<Interaction | null>(null)

const fetchAuthorInteraction = async () => {
  authorInteraction.value = await getAuthorInteractionForResource(props.resourceId)
}

const publishInteraction = async () => {
  if (!authorInteraction.value || !authorInteraction.value.id) return
  await updateInteraction(authorInteraction.value.id, { ...authorInteraction.value, interaction_is_public: true })
  fetchAuthorInteraction()
}

const unpublishInteraction = async () => {
  if (!authorInteraction.value || !authorInteraction.value.id) return
  await updateInteraction(authorInteraction.value.id, { ...authorInteraction.value, interaction_is_public: false })
  fetchAuthorInteraction()
}


/************** comments section *****************/
const { getCommentsForThoughtOutput } = useComments()
const comments = ref<Comment[]>([])

onMounted(async () => {
  resourceIsLoaded.value = false
  resource.value = await getResource(props.resourceId)
  resourceIsLoaded.value = true
  await loadBiblio()
  await loadInteractions()
  await loadUsages()
  comments.value = await getCommentsForThoughtOutput(props.resourceId)
  authorInteraction.value = await getAuthorInteractionForResource(props.resourceId)

  if (authorInteraction.value)
    resourceUser.value = await getUserById(authorInteraction.value.interaction_user_id)
  const editing = route.query.editing
  editingMetaData.value = editing === 'false' ? false : !!editing
})
</script>
