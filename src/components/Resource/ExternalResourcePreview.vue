<template>
  <div>
    <TextInput
      v-model="externalContentUrl"
      class="mb-4"
      @keyup.enter="startPreview"
      label="Lien ressource externe"
    />
    <ActionButton v-if="canLoadNewPreview" class="mb-4" text="Preview" @click="startPreview" type="valid"
      >Générer</ActionButton
    >
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { type Resource } from '@/types/models'
import { useLinkPreview } from '@/composables/useLinkPreview'
import { ref, computed } from 'vue'

const emit = defineEmits(["change"])
const { postLinkPreview } = useLinkPreview()

const startPreview = async () => {
  const response = await postLinkPreview({ external_content_url: externalContentUrl.value })
  console.log(response)
  lastPreview.value = externalContentUrl.value
  emit("change", response)
}
const externalContentUrl = ref<string>('')
const lastPreview = ref<string>('')

const canLoadNewPreview = computed(() => {
  return lastPreview.value !== externalContentUrl.value
})
</script>
