<template>
  <div>
    <div v-for="(article, i) in articles" :key="i">{{ article.title }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
