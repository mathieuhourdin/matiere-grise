<template>
  <main>
    <HomeBanner />
    <div class="max-w-3xl mx-auto px-8">
      <p class="m-6 text-center">
        Bienvenue, sur le site de Mathieu Hourdin qui va parler de plein de choses différentes,
        notamment de comment sauver le monde, et s'amuser dans la vie, rien que ça.
      </p>
      <RoundLinkButton to="/articles/new">+</RoundLinkButton>
      <ArticlesList />
    </div>
  </main>
</template>

<script setup lang="ts">
import HomeBanner from '../components/HomeBanner.vue'
import ArticlesList from '../components/ArticlesList.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
</script>
