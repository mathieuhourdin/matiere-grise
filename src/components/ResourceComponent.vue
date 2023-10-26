<template>
  <div v-if="!!resource" class="mx-auto">
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
        <router-link v-if="resourceUser" :to="'/users/' + resourceUser.id" class="text-sm underline"
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
          v-if="resource.resource_type === 'atcl'"
          class="ml-auto underline"
          :href="resource.external_content_url"
        >
          Ajouter un commentaire
        </a>
      </div>
    </div>
    <div v-else>
      <ArticleForm
        :article="resource"
        @change="(event) => debouncedUpdateResource(resource.id, event)"
      />
      <ResourceAuthorPicker
        class="mx-4"
        :interaction="authorInteraction"
        :resource-id="id"
        @change="updateAuthorInteraction"
      />
      <!--<ProblemForm
        v-else
        :problem="resource"
        @change="(event) => debouncedUpdateResource(resource.id, event)"
      />-->
      <div class="flex flex-row-reverse">
        <ActionButton class="mx-4" @click="setEditingMetaData(false)" type="valid" text="Preview"
          >Ok</ActionButton
        >
        <ActionButton
          v-if="resource.publishing_state == 'drft'"
          @click="publishResource"
          type="valid"
          text="Publier"
        />
        <div v-else class="p-2 border rounded bg-neutral-100">Publié</div>
      </div>
    </div>
    <div>
      <ToggleButtonGroup :choices="tabChoices" :default="toggleDefault" :url-key="urlParam" url />
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <div v-if="current_tab == 'ctnt'">
      <div class="text-xs italic">Commentaire</div>
      <TextInterface
        :full-text="resource.comment"
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
      <hr class="border-top border-zinc-400 my-4" />
      <div class="text-xs italic">Contenu</div>
      <TextInterface
        v-if="resource.publishing_state != 'drft'"
        :ext-comments="comments"
        :resource-id="resource.id"
        :full-text="resource.content"
        :editable="isResourceEditable"
        @change="(event) => debouncedUpdateResourceContent(event)"
      />
      <TextAreaInput
        v-else
        class="h-96"
        label="Contenu"
        :modelValue="resource.content"
        @update:modelValue="(event) => debouncedUpdateResourceContent(event)"
      />
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
    <div class="fixed right-3 bottom-5">
      <RoundLinkButton v-if="isResourceEditable" title="Modifier" @click="setEditingMetaData(true)"
        ><PencilSquareIcon class="m-1"
      /></RoundLinkButton>
      <RoundLinkButton
        class="mt-2"
        color="red"
        title="Marquer comme lu"
        v-if="isResourceEditable"
        @click="openAddInteraction = true"
        ><ArrowDownOnSquareIcon class="m-1"
      /></RoundLinkButton>
      <ModalSheet :open="openAddInteraction" @close="openAddInteraction = false">
        <CreateInteraction
          @refresh="loadInteractions"
          @close="openAddInteraction = false"
          :resource="resource"
        />
      </ModalSheet>
      <RoundLinkButton
        class="mt-2"
        color="green"
        title="Relier à d'autres ressources"
        v-if="isResourceEditable"
        @click="openAddResourceRelationAsOrigin = true"
        ><ShareIcon class="m-1"
      /></RoundLinkButton>
      <ModalSheet
        :open="openAddResourceRelationAsOrigin"
        @close="openAddResourceRelationAsOrigin = false"
      >
        <CreateResourceRelationForm
          @refresh="loadUsages"
          @close="openAddResourceRelationAsOrigin = false"
          :origin-resource="resource"
        />
      </ModalSheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateResourceRelationForm from '@/components/CreateResourceRelationForm.vue'
import CreateInteraction from '@/components/CreateInteraction.vue'
import DateField from '@/components/Ui/DateField.vue'
import ToggleButtonGroup from '@/components/Ui/ToggleButtonGroup.vue'
import TextInterface from '@/components/TextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ResourceAuthorPicker from '@/components/ResourceAuthorPicker.vue'
import ProblemForm from '@/components/ProblemForm.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import { useResource } from '@/composables/useResource'
import { useInteraction } from '@/composables/useInteraction'
import { useComments } from '@/composables/useComments'
import { useUser } from '@/composables/useUser'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { PencilSquareIcon, ArrowDownOnSquareIcon, ShareIcon } from '@heroicons/vue/24/outline'
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
  id: string
  secondLevel?: boolean
}>()
const route = useRoute()

/************** tabs ******************/

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
const openAddResourceRelationAsOrigin = ref(false)

const loadBiblio = async () => {
  resourceRelations.value = await getResourceRelationsForResource(toRefs(props).id.value)
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

onMounted(() => loadBiblio())

/************** interactions *****************/

const interactions = ref<Interaction[]>([])

const { getInteractionsForResource } = useInteraction()

const loadInteractions = async () => {
  interactions.value = await getInteractionsForResource(props.id)
}

onMounted(async () => await loadInteractions())

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

onMounted(async () => await loadUsages())

const loadUsages = async () => {
  targetResources.value = await getUsagesForResource(props.id)
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
const setEditingMetaData = (value: boolean) => {
  router.push({ query: { editing: value.toString() } })
}

const publishResource = () => {
  if (!resource.value || !resource.value.id) return
  resource.value.publishing_state = 'pbsh'
  updateResource(resource.value.id, resource.value)
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
  if (newResourceContent == '\n') return
  debouncedUpdateResource(toRefs(props).id.value, {
    ...resource.value,
    content: newResourceContent
  })
}
const debouncedUpdateResourceComment = (newResourceComment: string) => {
  if (newResourceComment == '\n') return
  debouncedUpdateResource(toRefs(props).id.value, {
    ...resource.value,
    comment: newResourceComment
  })
}

/************** user section *********************/
const { user, getUserById } = useUser()
const isResourceEditable = computed(() => {
  if (resource.value.is_external) return true
  if (!user.value || !resourceUser.value) return false
  return resourceUser.value.id == user.value.id
})

const resourceUser: Ref<User | null> = ref<User | null>(null)

/************** interactions section *************/

const authorInteraction = ref<Interaction | null>(null)

const openAddInteraction = ref<boolean>(false)

const updateAuthorInteraction = async () => {
  authorInteraction.value = await getAuthorInteractionForResource(props.id)
}

/************** comments section *****************/
const { getCommentsForThoughtOutput } = useComments()
const comments = ref<Comment[]>([])

onMounted(async () => {
  resource.value = await getResource(props.id)
  comments.value = await getCommentsForThoughtOutput(props.id)
  authorInteraction.value = await getAuthorInteractionForResource(props.id)

  if (authorInteraction.value)
    resourceUser.value = await getUserById(authorInteraction.value.interaction_user_id)
  const editing = route.query.editing
  editingMetaData.value = editing === 'false' ? false : !!editing
})
</script>
