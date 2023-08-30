<template>
  <div>
    <div class="max-w-xl mt-8 mx-auto border-2 p-4">
        <div>Nouvel Article</div>
        <ArticleForm class="w-full" :article="article" @change="(event) => (article = event)" />
        <div class="flex">
          <ActionButton @click="createArticle(article)" text="Valider" type="valid" class="ml-auto m-4"/>
        </div>
    </div>
  </div>
</template>

<script setup>
import ArticleForm from '@/components/ArticleForm.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useArticle } from '@/composables/useArticle.ts'
import { ref } from 'vue'

const { newArticle, createArticle } = useArticle()
const article = newArticle()
</script>
