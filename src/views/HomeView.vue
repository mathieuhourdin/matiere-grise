<template>
  <main>
    <div class="px-8" >
      <!--<p class="m-6 text-center">
        Bienvenue, sur la plateforme de Mathieu Hourdin qui va parler de plein de choses différentes,
        notamment de comment sauver le monde, et s'amuser dans la vie, rien que ça.
      </p>-->
      <ArticlesList :maturing-state="maturingState" style="min-height: 40rem" />
    </div>
  </main>
</template>

<script setup lang="ts">
import ArticlesList from '@/components/Article/ArticlesList.vue'

const props = defineProps<{
  maturingState?: string
}>()
</script>
