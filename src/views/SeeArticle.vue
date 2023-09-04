<template>
  <div v-if="!!article" class="px-8 mx-auto">
    <RoundLinkButton class="fixed right-4 bottom-10" :to="`/articles/${article.id}/edit`"
      ><PencilSquareIcon class="m-1"
    /></RoundLinkButton>
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
      <a class="ml-auto underline" :href="article.gdoc_url">Ajouter un commentaire</a>
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <TextInterface
      :ext-comments="comments"
      :ressource-id="article.id"
      :full-text="article.content"
      :editable="isArticleAuthor"
      @change="(event) => debouncedUpdateArticle(event)"
    />
  </div>
</template>

<script setup lang="ts">
import TextInterface from '@/components/TextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import { useArticle } from '@/composables/useArticle.ts'
import { useComments } from '@/composables/useComments.ts'
import { useUser } from '@/composables/useUser.ts'
import { fetchWrapper } from '@/helpers'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { marked } from 'marked'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
const props = defineProps<{
  id: String
}>()

/************** article section ******************/
const { getArticle, updateArticle } = useArticle()
const debouncedUpdate = ref(null)
const article = ref(null)

const debouncedUpdateArticle = (newArticle) => {
  console.log('New article : ', newArticle)
  if (newArticle == "\n") return
  clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    try {
      await updateArticle(toRefs(props).id.value, { ...article.value, content: newArticle })
    } catch (error) {
      console.log("An error : ", error)
    }
  }, 2000)
}

/************** user section *********************/
const { user } = useUser()
const isArticleAuthor = computed(() => {
  if (!user.value) return false
  return article.value.author_id == user.value.id
})

/************** comments section *****************/
const { getCommentsForArticle } = useComments()
const comments = ref([])

const articleContentHtml = computed(() => (article.value ? marked(article.value.content) : null))

onMounted(async () => {
  article.value = await getArticle(props.id)
  comments.value = await getCommentsForArticle(props.id)
})
</script>

<style>
div.article-content > p {
  margin-bottom: 1rem;
}
div.article-content > h1 {
  font-size: 2em;
  font-weight: 800;
}
div.article-content > h2 {
  font-size: 1.5em;
  font-weight: 700;
}
div.article-content > h3 {
  font-size: 1em;
  font-weight: 600;
}
div.article-content > h4 {
  font-size: 0.8em;
  font-weight: 500;
}
</style>
