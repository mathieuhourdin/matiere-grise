<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="(article, i) in articles" :key="i">
      <ArticleCard
        :title="article.title"
        :description="article.description"
        :image-url="article.image_url"
        :progress="article.progress"
        />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue';
import { fetchWrapper } from "@/helpers";

const articles = ref([]);
const getArticles = async () => {
  let response = await fetchWrapper.get("/articles");
  return response;
};

onMounted(async () => articles.value = await getArticles());
</script>
