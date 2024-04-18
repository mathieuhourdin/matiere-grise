<template>
  <div class="mx-10 mt-10">
    <TextInput
      v-model="externalContentUrl"
      class="mb-4"
      @keyup.enter="startPreview"
      label="Lien ressource externe"
    />
    <div v-if="preview">
      <TextInput class="mb-4" v-model="preview.title" label="Titre" />
      <TextInput class="mb-4" v-model="preview.subtitle" label="Description" />
      <img class="mb-4" :src="preview.image_url" />
      <SelectInput
        label="Type de ressource"
        class="mb-4"
        :choices="resourceTypeOptions"
        @update:modelValue="(event) => emitChange('resource_type', event)"
        :model-value="preview.resource_type"
      />
    </div>
    <ActionButton class="mb-4" text="Preview" @click="startPreview" type="valid"
      >Générer</ActionButton
    >
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useLinkPreview } from '@/composables/useLinkPreview'
import { ref } from 'vue'

const { postLinkPreview } = useLinkPreview()

const startPreview = async () => {
  const response = await postLinkPreview({ external_content_url: externalContentUrl.value })
  console.log(response)
  preview.value = response
}

const externalContentUrl = ref<String>('')
const preview = ref<any>(null)

const resourceTypeOptions = ref([
  { text: 'Livre', value: 'book' },
  { text: 'Fiche de lecture', value: 'shet' },
  { text: 'Article de média', value: 'natc' },
  { text: 'Article de recherche', value: 'ratc' },
  { text: 'Film', value: 'movi' },
  { text: 'Podcast', value: 'pcst' }
])
</script>
