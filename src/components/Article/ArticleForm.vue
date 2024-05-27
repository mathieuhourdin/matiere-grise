<template>
  <div class="grid grid-cols-4 gap-y-2 gap-x-4 auto-rows-auto">
    <TextInput
      class="col-span-4"
      label="Titre"
      :modelValue="article.title"
      @update:modelValue="(event) => emitChange('title', event)"
    />
    <TextInput
      class="col-span-4"
      label="Sous-titre"
      :modelValue="article.subtitle"
      @update:modelValue="(event) => emitChange('subtitle', event)"
    />
    <TextInput
      class="col-span-4 md:col-span-2"
      label="Lien contenu externe"
      :modelValue="article.external_content_url"
      @update:modelValue="(event) => emitChange('external_content_url', event)"
    />
    <TextInput
      class="col-span-4 md:col-span-2"
      label="Lien image"
      :modelValue="article.image_url"
      @update:modelValue="(event) => emitChange('image_url', event)"
    />
    <SelectInput
      label="Type de ressource"
      class="col-span-4 md:col-span-2"
      :choices="resourceTypeOptions"
      @update:modelValue="(event) => emitChange('resource_type', event)"
      :model-value="article.resource_type"
    />
    <SelectInput
      label="Ressource externe"
      class="col-span-4 md:col-span-1"
      :choices="[
        { text: 'Oui', value: true },
        { text: 'Non', value: false }
      ]"
      @update:modelValue="(event) => emitChange('is_external', JSON.parse(event))"
      :model-value="article.is_external"
    />
    <SelectInput
      label="Stade d'écriture"
      class="col-span-4 md:col-span-1"
      :choices="maturingStateOptions"
      :model-value="article.maturing_state"
      @update:modelValue="(event) => emitChange('maturing_state', event)"
    />
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import CheckboxInput from '@/components/Ui/CheckboxInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { useResource } from '@/composables/useResource'
import { type Article } from '@/types/models'
import { ref, computed } from 'vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  article: Article
}>()

const maturingStateOptions = ref([
  { text: 'Terminé', value: 'fnsh' },
  { text: 'Relecture', value: 'rvew' },
  { text: 'Brouillon', value: 'drft' },
  { text: 'Poubelle', value: 'trsh' }
])

const { resourceTypeOptions } = useResource()

const emitChange = (field: string, event: any) => {
  let article: any = { ...props.article }
  article[field] = event
  if (article.is_external) {
    article.maturing_state = 'fnsh'
  }
  console.log("Article : ", article)
  emit('change', article)
}
</script>
