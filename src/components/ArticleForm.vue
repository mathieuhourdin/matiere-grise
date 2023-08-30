<template>
  <div>
    <TextInput
      label="Titre"
      :modelValue="article.title"
      @update:modelValue="(event) => $emit('change', { ...article, title: event })"
    />
    <TextInput
      class="h-6"
      label="Description"
      :modelValue="article.description"
      @update:modelValue="(event) => $emit('change', { ...article, description: event })"
    />
    <div class="flex">
      <TextInput
        class="mr-auto h-6"
        label="Progression"
        :modelValue="article.progress"
        @update:modelValue="(event) => $emit('change', { ...article, progress: event })"
      />
      <TextInput
        class="h-6"
        label="Stade d'écriture"
        :modelValue="article.maturing_state"
        @update:modelValue="(event) => $emit('change', { ...article, maturing_state: event })"
      />
    </div>
    <div class="flex">
      <TextInput
        class="h-6"
        label="Lien Gdoc"
        :modelValue="article.gdoc_url"
        @update:modelValue="(event) => $emit('change', { ...article, gdoc_url: event })"
      />
      <TextInput
        class="h-6"
        label="Lien image"
        :modelValue="article.image_url"
        @update:modelValue="(event) => $emit('change', { ...article, image_url: event })"
      />
      <TextInput
        class="h-6"
        label="Suffix url"
        :modelValue="article.url_slug"
        @update:modelValue="(event) => $emit('change', { ...article, url_slug: event })"
      />
    </div>
    <TextAreaInput
      label="Pistes d'amélioration"
      :modelValue="article.potential_improvements"
      @update:modelValue="(event) => $emit('change', { ...article, potential_improvements: event })"
    />
    <TextAreaInput
      class="h-60"
      label="Contenu"
      :modelValue="article.content"
      @update:modelValue="(event) => $emit('change', { ...article, content: event })"
    />
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { Article } from '@/composables/useArticle.ts'

const props = defineProps<{
  article: Article
}>()
</script>
