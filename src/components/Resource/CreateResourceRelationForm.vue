<template>
  <div>
    <div v-if="user" class="mb-4">
      Nouvelle relation entre ressources par {{ user.first_name }} {{ user.last_name }}
    </div>
    <div v-if="!selectedLinkResource">
      <ThoughtInputsList
        v-if="targetResource"
        :contextual-resources="contextualOriginResources"
        center
        links-disabled
        @select="(event) => selectResource(event)"
      />
      <div v-else>
        <div>
          Choisir une ressource cible
          <ToggleButtonGroup center :choices="tabChoices" default="pblm" @update="updateTab" />
          <ThoughtInputsList
            :contextual-resources="contextualTargetResources[localTab] || []"
            center
            @select="(event) => selectResource(event)"
            links-disabled
          />
        </div>
      </div>
    </div>
    <div v-else>
      <SelectInput
        class="m-4"
        label="Type de lien"
        :choices="relationTypeOptions"
        v-model="relation_type"
      />
      <TextAreaInput class="m-4" label="Pourquoi ajouter cet élément ?" v-model="relation_comment" />
      <div class="flex flex-row-reverse">
        <ActionButton type="valid" @click="localCreateResourceRelation" text="Ajouter" />
        <ActionButton type="abort" @click="emit('close')" text="Annuler" class="mr-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleButtonGroup from '@/components/Ui/ToggleButtonGroup.vue'
import SelectInput from '@/components/Ui/SelectInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ThoughtInputsList from '@/components/ThoughtInput/ThoughtInputsList.vue'
import { useUser } from '@/composables/useUser'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { useResource } from '@/composables/useResource'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { useProblem } from '@/composables/useProblem'
import { ref, computed, onMounted } from 'vue'
import { type ApiInteraction, type ApiResource } from '@/types/models'
const { user } = useUser()

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  targetResource?: ApiResource
  originResource?: ApiResource
}>()

const localTab = ref<string | null>()
const updateTab = (event) => {
  console.log('Event : ', event)
  localTab.value = event
}
const tabChoices = ref([
  { text: 'Externes', value: 'extr' },
  { text: 'Internes', value: 'artl' },
  { text: 'Problème', value: 'pblm' }
])
const relationTypeOptions = ref([
  { text: 'Biblio', value: 'bibl' },
  { text: 'Résumé', value: 'sumr' },
  { text: 'Sujet principal', value: 'main' },
  { text: 'Evocation', value: 'mino' }
])
const thoughtInputs = ref<ApiInteraction[]>([])
const selectedLinkResource = ref<ApiResource | null>(null)
const externalResources = ref<ApiResource[]>([])
const internalArticles = ref<ApiResource[]>([])
const problems = ref<ApiResource[]>([])
const relation_comment = ref('')
const relation_type = ref('')

const { createResourceRelation } = useResourceRelations()
const { getResources } = useResource()
const { getProblems } = useProblem()

const contextualOriginResources = computed(() => {
  return thoughtInputs.value.map((thoughtInput) => {
    return {
      resource: thoughtInput.resource
    }
  })
})

const resourceToContextualResource = (resources: ApiResource[]) => {
  return resources.map((resource) => {
    return { resource }
  })
}

const contextualTargetResources = computed(() => {
  return {
    extr: resourceToContextualResource(externalResources.value),
    artl: resourceToContextualResource(internalArticles.value),
    pblm: resourceToContextualResource(problems.value)
  }
})

const localCreateResourceRelation = async () => {
  console.log('create')
  if (!selectedLinkResource.value) return
  const thought_input_usage = {
    target_resource_id: props.targetResource
      ? props.targetResource.id
      : selectedLinkResource.value.id,
    origin_resource_id: props.originResource
      ? props.originResource.id
      : selectedLinkResource.value.id,
    relation_comment: relation_comment.value,
    relation_type: relation_type.value
  }
  await createResourceRelation(thought_input_usage)
  emit('refresh')
  emit('close')
}

const { getUserThoughtInputs } = useThoughtInputs()

const selectResource = (contextualResource: ContextualResource) => {
  selectedLinkResource.value = contextualResource.resource
}

onMounted(async () => {
  if (!user.value || !user.value.id) return
  if (props.targetResource) thoughtInputs.value = await getUserThoughtInputs(user.value.id)
  if (props.originResource) {
    externalResources.value = await getResources({ is_external: true })
    internalArticles.value = await getResources({ is_external: false, resource_type: 'oatc' })
    problems.value = await getResources({ is_external: false, resource_type: 'pblm' })
  }
})
</script>
