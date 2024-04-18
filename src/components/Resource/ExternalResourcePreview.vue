<template>
  <div class="mx-10 mt-10">
    <TextInput v-model="externalContentUrl" class="p-2" @keyup.enter="startPreview" label="Lien ressource externe"/>
    <ActionButton class="mb-4" text="Preview" @click="startPreview" type="valid">Preview</ActionButton>
    <div v-if="preview">
      <TextInput class="mb-4" v-model="preview.title" label="Titre" />
      <TextInput class="mb-4" v-model="preview.subtitle" label="Description" />
      <img :src="preview.image_url" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
