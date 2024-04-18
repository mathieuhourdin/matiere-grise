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
        @update:modelValue="(event) => productionDate = event"
        type="date"
      />
      <ActionButton type="valid" text="Valider" @click="processStep = 2" />
    </div>
    <div v-if="processStep === 2">
      <div v-if="isExternal"><ExternalResourcePreview /></div>
      <div v-else>Nouvelle resource</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExternalResourcePreview from '@/components/Resource/ExternalResourcePreview.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import UserPicker from '@/components/User/UserPicker.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import { ref } from 'vue'
import { type Resource } from '@/types/models'
import { useUser } from '@/composables/useUser'
import { useResource } from '@/composables/useResource'

const processStep = ref<number>(0)

const { newResource } = useResource()

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
  is_local_draft: true
})

const chooseIsExternal = (value) => {
  isExternal.value = value
  if (!value) {
    //internal resource. The author is the logged in user
    resourceAuthorId.value = user.value.id
    resource.value.maturing_state = 'idea'
    processStep.value = 2
  } else {
    processStep.value = 1
    resource.maturing_state = 'fnsh'
  }
}

const { user } = useUser()
const resourceAuthorId = ref<string | null>(null)
const productionDate = ref<string | null>(null)

const isExternal = ref<boolean>(false)
</script>
