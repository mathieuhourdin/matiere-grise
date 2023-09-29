<template>
  <div>
    <TextInput
      label="Titre"
      :modelValue="article.resource_title"
      @update:modelValue="(event) => emitChange('resource_title', event)"
    />
    <TextInput
      class="h-6"
      label="Sous-titre"
      :modelValue="article.resource_subtitle"
      @update:modelValue="(event) => emitChange('resource_subtitle', event)"
    />
    <div class="flex">
      <NumberInput
        class="mr-auto h-6"
        label="Progression"
        :modelValue="article.interaction_progress"
        @update:modelValue="(event) => emitChange('progress', event)"
      />
      <div class="ml-auto h-6 m-4 w-1/3">
        <SelectInput
          label="Catégorie"
          :choices="categoryOptions"
          :model-value="article.resource_category_id"
          @update:modelValue="(event) => emitChange('resource_category_id', event)"
        />
      </div>
      <div class="ml-auto h-6 m-4 w-1/3">
        <SelectInput
          label="Stade d'écriture"
          :choices="maturingStateOptions "
          :model-value="article.resource_maturing_state"
          @update:modelValue="(event) => emitChange('maturing_state', event)"
        />
      </div>
    </div>
    <div class="flex">
      <TextInput
        class="h-6"
        label="Lien contenu externe"
        :modelValue="article.resource_external_content_url"
        @update:modelValue="(event) => emitChange('resource_external_content_url', event)"
      />
      <TextInput
        class="h-6"
        label="Lien image"
        :modelValue="article.resource_image_url"
        @update:modelValue="(event) => emitChange('resource_image_url', event)"
      />
    </div>
    <TextAreaInput
      label="Pistes d'amélioration"
      :modelValue="article.resource_comment"
      @update:modelValue="(event) => emitChange('resource_comment', event)"
    />
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { useCategories } from '@/composables/useCategories'
import { type Article } from '@/types/models'
import { ref, computed } from 'vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  article: Article
}>()

const maturingStateOptions = ref([
  { text: "Terminé", value: "fnsh"},
  { text: "Relecture", value: "rvew"},
  { text: "Idée", value: "idea"},
])

const { categories } = useCategories();
const categoryOptions = computed(() => {
  return categories.value.map((category) => ({ text: category.display_name, value: category.id }))
})

const emitChange = (field: string, event: any) => {
  let article: any = { ...props.article }
  article[field] = event
  emit('change', article)
}
</script>
