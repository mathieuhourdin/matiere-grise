<template>
  <div>
    <div class="flex flex-wrap my-8">
      <div class="mx-auto flex flex-wrap max-w-full">
        <ActionButton
          class="w-24 mx-auto my-1"
          text="Terminés"
          @click="updateTab('fnsh')"
          :type="isSelected('fnsh')"
          >Terminés</ActionButton
        >
        <ActionButton
          class="w-24 mx-auto my-1"
          text="Relecture"
          @click="updateTab('rvew')"
          :type="isSelected('rvew')"
          >Review</ActionButton
        >
        <ActionButton
          class="w-24 mx-auto my-1"
          text="Idées"
          @click="updateTab('idea')"
          :type="isSelected('idea')"
        >
          Idées
        </ActionButton>
      </div>
      <ActionButton
        v-if="draftArticles.length > 0"
        class="mr-auto my-1"
        text="Mes brouillons"
        @click="updateTab('drft')"
        :type="isSelected('drft')"
        >Mes brouillons</ActionButton
      >
      <RoundLinkButton
        class="md:absolute mx-auto md:mx-0"
        v-if="user"
        @click="createDraftArticleAndRedirect"
        >+</RoundLinkButton
      >
    </div>
    <div class="text-center mb-8 text-sm">{{ maturingStateTexts(tab) }}</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(article, i) in filterArticles(tab, articles)" :key="i">
        <ArticleCard
          :title="article.title"
          :subtitle="article.subtitle"
          :image-url="article.image_url"
          :progress="article.interaction_progress"
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
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useArticle } from '@/composables/useArticle'
import { useRouter, useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { type Article } from '@/types/models'

const props = defineProps<{
  maturingState?: string
}>()

const articles = ref([])
const draftArticles = ref([])
const tab = ref<string | null>(null)

const maturingStateTexts = (maturingState: string | null) => {
  if (!maturingState) return ''
  const match: any = {
    idea: "Simples idées qu'on a eu en passant, et qui peuvent être reprises par d'autres",
    rvew: "Articles déjà bien strucutrés, qui ont besoin d'être relus pour gagner en qualité",
    fnsh: 'Articles qui peuvent donner lieu à des discussions mais qui ont atteint un stade abouti, lisible par le grand public'
  }
  return match[maturingState]
}

const router = useRouter()
const route = useRoute()
const updateTab = (tabValue: string) => {
  tab.value = tabValue
  router.push({ path: '/', query: { maturing_state: tabValue } })
}

const { getArticles, newArticle, createArticle } = useArticle()

const filterArticles = (filter: string | null, articles: Article[]) => {
  if (!filter) return []
  if (filter == 'drft') return draftArticles.value
  return articles.filter((article) => article.maturing_state == filter)
}

const isSelected = (type: string) => {
  return tab.value == type ? 'valid' : 'abort'
}

/******************* article creation ***********************/

const { user } = useUser()

const createDraftArticleAndRedirect = async () => {
  const draftArticle = newArticle()
  const createdArticle = await createArticle(draftArticle.value)
  router.push({ path: '/articles/' + createdArticle.id, query: { editing: 'true' } })
}

/*********************/

onMounted(async () => {
  articles.value = await getArticles({ author: true })
  draftArticles.value = await getArticles({ author: false, drafts: true })
  if (typeof route.query.maturing_state === 'string') {
    tab.value = route.query.maturing_state
  } else {
    tab.value = 'fnsh'
  }
  updateTab(tab.value)
})
</script>
