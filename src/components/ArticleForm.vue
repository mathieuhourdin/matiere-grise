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
      <div class="ml-auto h-6 m-4 w-1/3">
        <label class="block text-2xs text-slate-800">Stade d'écriture</label>
        <select
          :value="article.maturing_state"
          name="Stade d'écriture"
          class="text-xs w-full p-1 block rounded border-2 border-neutral-400"
          @input="(event) => emitChange('maturing_state', event.target.value)"
        >
          <option disabled value="">Choisissez</option>
          <option value="over">Terminé</option>
          <option value="rvew">Relecture</option>
          <option value="prgs">En cours</option>
          <option value="idea">Idée</option>
        </select>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { Article } from '@/composables/useArticle.ts'

const emit = defineEmits(['change'])
const props = defineProps<{
  article: Article
}>()

const emitChange = (field, event) => {
  let article = { ...props.article }
  article[field] = event
  emit('change', article)
}
</script>
