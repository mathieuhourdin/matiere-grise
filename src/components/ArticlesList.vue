<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="(article, i) in articles" :key="i">
      <ArticleCard
        :title="article.title"
        :description="article.description"
        :image-url="article.image_url"
        />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue';

const articles = ref([]);
const getArticles = async () => {
  let url = "http://127.0.0.1:8080/articles";
  let options = {
    method: "GET",
    credentials: "include",
  };
  let response = await fetch(url, options);
  return response.json();
};

onMounted(async () => articles.value = await getArticles());
</script>
