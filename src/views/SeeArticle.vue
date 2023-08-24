<template>
  <div v-if="!!article" class="px-8 max-w-3xl mx-auto">
    <div class="my-8">
      <img
        :src="article.image_url"
        class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
      />
    </div>
    <h1 class="text-3xl my-3 font-mplus md:text-center text-left">{{ article.title }}</h1>
    <div class="md:text-center text-left">{{ article.description }}</div>
    <div class="md:flex my-8">
      <ProgressBar :progress-value="article.progress" class="w-1/3" />
      <a class="ml-auto underline" :href="article.gdoc_url" >Ajouter un commentaire</a>
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <div v-html="articleContentHtml" class="article-content"></div>
  </div>
</template>

<script setup lang="ts">
import { fetchWrapper } from '@/helpers'
import ProgressBar from '@/components/ProgressBar.vue'
import { marked } from 'marked'
import { ref, computed, onMounted } from 'vue'
const props = defineProps<{
  uuid: String
}>()

const article = ref(null)

const fetchArticle = async () => {
  const response = await fetchWrapper.get('/articles/' + props.uuid)
  article.value = response.data
}

const articleContentHtml = computed(() => (article.value ? marked(article.value.content) : null))

onMounted(() => fetchArticle())
</script>

<style>
div.article-content > p {
  margin-bottom: 1rem;
}
</style>
