<template>
  <div class="p-4">
    Ressources
    <div class="text-sm italic underline">Ajouter une resource externe non existante</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div v-for="(article, i) in resources" :key="i">
        <ArticleCard
          :title="article.title"
          :subtitle="article.subtitle"
          :image-url="article.image_url"
          :uuid="article.id"
          :author="article.author"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'
import { useResource } from '@/composables/useResource'
import { ref, onMounted } from 'vue'

const { getResources } = useResource()

const resources = ref<Resource[]>([])

onMounted(async () => (resources.value = await getResources()))
</script>
