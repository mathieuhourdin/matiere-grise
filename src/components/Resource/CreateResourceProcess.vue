<template>
  <div class="mt-10 mx-5">
    <div v-if="processStep === 0">
      <div>
        <ActionButton
          class="mb-2"
          text="Resource Externe"
          type="valid"
          @click="chooseIsExternal(true)"
        /><ActionButton
          text="Production personnelle"
          type="valid"
          @click="chooseIsExternal(false)"
        />
      </div>
    </div>
    <div v-if="processStep === 1">
      <UserPicker class="mb-4" v-model="resourceAuthorId" />
      <TextInput
        v-if="resourceAuthorId"
        class="text-2xs mb-4"
        label="Date d'écriture"
        :model-value="productionDate"
        @update:modelValue="(event) => (productionDate = event)"
        type="date"
      />
      <ActionButton type="valid" text="Valider" @click="processStep = 2" />
    </div>
    <div v-if="processStep === 2">
      <div>
        <ExternalResourcePreview v-if="isExternal" @change="(event) => applyPreview(event)" />
        <div>Optionnel : ajouter le contenu à partir d'un fichier La-tex</div>
        <input id="file" type="file" @change="uploadFile" placeholder="Ajouter depuis un fichier" />
        <div v-if="!isExternal || isPreviewLoaded">
          <TextInput class="mb-4" v-model="resource.title" label="Titre" />
          <TextInput class="mb-4" v-model="resource.subtitle" label="Description" />
          <TextInput class="mb-4" v-model="resource.image_url" label="Url de l'image" />
          <img class="mb-4" :src="resource.image_url" />
          <SelectInput
            label="Type de ressource"
            class="mb-4"
            :choices="resourceTypeOptions"
            v-model="resource.resource_type"
          />
          <div v-if="resource.content !== ''">
            <div class="text-2xs text-slate-800">Text formaté</div>
            <SelectionTextInterface
              class="max-h-40 overflow-scroll border border-slate-400 mb-4 p-2 rounded"
              type="textarea"
              :text="resource.content"
            />
          </div>
          <ActionButton
            class="mb-4"
            text="Créer"
            @click="createResourceAndInteractionAndRedirect"
            type="valid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExternalResourcePreview from '@/components/Resource/ExternalResourcePreview.vue'
import SelectInput from '@/components/Ui/SelectInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import UserPicker from '@/components/User/UserPicker.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import SelectionTextInterface from '@/components/SelectionTextInterface.vue'
import { ref } from 'vue'
import { type Resource } from '@/types/models'
import { useUser } from '@/composables/useUser'
import { useResource } from '@/composables/useResource'
import { useInteraction } from '@/composables/useInteraction'
import { useRouter } from 'vue-router'
import { useFileConverter } from '@/composables/useFileConverter'

const processStep = ref<number>(0)

const { newResource, createResource, resourceTypeOptions } = useResource()

const resource = ref<Resource>({
  id: '',
  title: '',
  subtitle: '',
  content: '',
  external_content_url: '',
  publishing_state: '',
  maturing_state: '',
  image_url: '',
  resource_type: '',
  comment: '',
  is_local_draft: true,
  is_external: false
})

const chooseIsExternal = (value) => {
  isExternal.value = value
  if (!value) {
    //internal resource. The author is the logged in user
    resourceAuthorId.value = user.value.id
    resource.value.maturing_state = 'drft'
    resource.value.is_external = false
    processStep.value = 1
    productionDate.value = new Date(Date.now()).toISOString().split('T')[0]
  } else {
    processStep.value = 1
    resource.value.maturing_state = 'fnsh'
    resource.value.is_external = true
  }
}

const { postFileConversion } = useFileConverter()
const uploadFile = async (event) => {
  const file = event.target.files[0]

  const formData = new FormData()

  formData.append(file.name, file)

  const response = await postFileConversion(formData)
  resource.value.content = response.content
  resource.value.title = response.name
}

const { user } = useUser()
const resourceAuthorId = ref<string | null>(null)
const productionDate = ref<string | null>(null)

const isExternal = ref<boolean>(false)

const isPreviewLoaded = ref<boolean>(false)

const applyPreview = (preview: any) => {
  console.log('apply preview : ', preview)
  resource.value.title = preview.title
  resource.value.subtitle = preview.subtitle
  resource.value.image_url = preview.image_url
  resource.value.content = preview.content
  resource.value.resource_type = preview.resource_type
  resource.value.external_content_url = preview.external_content_url
  isPreviewLoaded.value = true
}

const { createInteractionForResource, newInteraction } = useInteraction()
const router = useRouter()

const createResourceAndInteractionAndRedirect = async () => {
  const createdResource = await createResource(resource.value)
  const interactionPayload = {
    interaction_user_id: resourceAuthorId.value,
    resource_id: createdResource.id,
    interaction_progress: isExternal ? 100 : 0,
    interaction_date: new Date(productionDate.value),
    interaction_comment: '',
    interaction_is_public: isExternal.value ? true : false
  }
  await createInteractionForResource(createdResource.id, interactionPayload)
  router.push({
    path: '/resources/' + createdResource.id,
    query: { editing: 'false' }
  })
}
</script>
