<template>
  <div>
    <TextInput
      label="Titre"
      :modelValue="article.title"
      @update:modelValue="(event) => emitChange('title', event)"
    />
    <TextInput
      class="h-6"
      label="Description"
      :modelValue="article.description"
      @update:modelValue="(event) => emitChange('description', event)"
    />
    <div class="flex">
      <NumberInput
        class="mr-auto h-6"
        label="Progression"
        :modelValue="article.progress"
        @update:modelValue="(event) => emitChange('progress', event)"
      />
      <TextInput
        class="h-6"
        label="Stade d'écriture"
        :modelValue="article.maturing_state"
        @update:modelValue="(event) => emitChange('maturing_state', event)"
      />
    </div>
    <div class="flex">
      <TextInput
        class="h-6"
        label="Lien Gdoc"
        :modelValue="article.gdoc_url"
        @update:modelValue="(event) => emitChange('gdoc_url', event)"
      />
      <TextInput
        class="h-6"
        label="Lien image"
        :modelValue="article.image_url"
        @update:modelValue="(event) => emitChange('image_url', event)"
      />
      <TextInput
        class="h-6"
        label="Suffix url"
        :modelValue="article.url_slug"
        @update:modelValue="(event) => emitChange('url_slug', event)"
      />
    </div>
    <TextAreaInput
      label="Pistes d'amélioration"
      :modelValue="article.potential_improvements"
      @update:modelValue="(event) => emitChange('potential_improvements', event)"
    />
    <TextInterface
      class="min-h-96"
      label="Contenu"
      :full-text="article.content"
      @change="(event) => emitChange('content', event)"
    />
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import TextInterface from '@/components/TextInterface.vue'
import { Article } from '@/composables/useArticle.ts'

const emit = defineEmits(['change'])
const props = defineProps<{
  article: Article
}>()

const emitChange = (field, event) => {
  let article = { ...props.article };
  article[field] = event;
  emit("change", article);
}
</script>
