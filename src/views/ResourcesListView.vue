<template>
  <div class="p-4">
    Ressources
    <div class="text-sm italic underline" @click="createDraftResourceAndRedirect">
      Ajouter une resource externe non existante
    </div>
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
import ArticleCard from '@/components/Article/ArticleCard.vue'
import { useResource } from '@/composables/useResource'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { getResources, createResource, newResource } = useResource()

const resources = ref<Resource[]>([])

const createDraftResourceAndRedirect = async () => {
  const resource = newResource()
  const createdResource = await createResource(resource)
  router.push({ path: '/thought_outputs/' + createdResource.id, query: { editing: 'true' } })
}

onMounted(async () => (resources.value = await getResources()))
</script>
