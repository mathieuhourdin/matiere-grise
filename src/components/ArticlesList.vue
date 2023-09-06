<template>
  <div>
    <div class="flex my-8">
      <ActionButton
        class="ml-auto"
        text="Terminés"
        @click="updateTab('fnsh')"
        :type="isSelected('fnsh')"
        >Terminés</ActionButton
      >
      <ActionButton text="Relecture" @click="updateTab('rvew')" :type="isSelected('rvew')"
        >Review</ActionButton
      >
      <ActionButton class="mr-auto" text="Idées" @click="updateTab('idea')" :type="isSelected('idea')"
        >Idées</ActionButton
      >
      <ActionButton class="mr-auto" text="Mes brouillons" @click="updateTab('drft')" :type="isSelected('drft')"
        >Mes brouillons</ActionButton
      >
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(article, i) in filterArticles(tab, articles)" :key="i">
        <ArticleCard
          :title="article.title"
          :description="article.description"
          :image-url="article.image_url"
          :progress="article.progress"
          :uuid="article.id"
          :author="article.author"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useArticle } from '@/composables/useArticle.ts'
import { useRouter } from 'vue-router'

const props = defineProps<{
  maturingState?: string
}>()

const articles = ref([])
const draftArticles = ref([])
const tab = ref(null)

const router = useRouter();
const updateTab = (tabValue) => {
  tab.value = tabValue
  router.push({ path: "/" + tabValue})
}

const { getArticles } = useArticle()

const filterArticles = (filter, articles) => {
  if (filter == "drft") return draftArticles.value
  return articles.filter((article) => article.maturing_state == filter)
}

const isSelected = (type) => {
  return tab.value == type ? 'valid' : 'abort'
}

onMounted(async () => {
  articles.value = await getArticles({author: true})
  draftArticles.value = await getArticles({author: false, drafts: true})
  tab.value = props.maturingState || "fnsh"
})
</script>
