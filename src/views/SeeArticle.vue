<template>
  <div v-if="!!article" class="px-8 mx-auto">
    <div v-if="!editingMetaData">
      <div class="my-8">
        <img
          :src="article.image_url"
          class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
        />
      </div>
      <h1 class="text-3xl my-3 font-mplus md:text-center text-left">{{ article.title }}</h1>
      <div class="md:text-center text-left">{{ article.description }}</div>
      <RoundLinkButton v-if="isArticleAuthor" @click="setEditingMetaData(true)"
        ><PencilSquareIcon class="m-1"
      /></RoundLinkButton>
      <div class="md:flex my-8">
        <ProgressBar :progress-value="article.progress" class="w-1/3" />
        <a class="ml-auto underline" :href="article.gdoc_url"> Ajouter un commentaire </a>
      </div>
    </div>
    <div v-else>
      <ArticleForm
        :article="article"
        @change="(event) => debouncedUpdateArticle(article.id, event)"
      />
      <div class="flex flex-row-reverse">
        <ActionButton class="mx-4" @click="setEditingMetaData(false)" type="valid" text="Preview"
          >Ok</ActionButton
        >
        <ActionButton
          v-if="article.publishing_state == 'drft'"
          @click="publishArticle"
          type="valid"
          text="Publier"
        />
        <div v-else class="p-2 border rounded bg-neutral-100">Publié</div>
      </div>
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <TextInterface
      :ext-comments="comments"
      :ressource-id="article.id"
      :full-text="article.content"
      :editable="isArticleAuthor"
      @change="(event) => debouncedUpdateArticleContent(event)"
    />
  </div>
</template>

<script setup lang="ts">
import TextInterface from '@/components/TextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useArticle } from '@/composables/useArticle.ts'
import { useComments } from '@/composables/useComments.ts'
import { useUser } from '@/composables/useUser.ts'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const props = defineProps<{
  id: String
}>()

/************** article section ******************/
const { getArticle, updateArticle } = useArticle()
const debouncedUpdate = ref(null)
const article = ref(null)
const route = useRoute()
const router = useRouter()
watch(
  () => route.query.editing,
  (editing) => {
    console.log('Editing : ', editing)
    editingMetaData.value = editing === 'false' ? false : !!editing
  }
)
const editingMetaData = ref(false)
const setEditingMetaData = (value) => {
  router.push({ query: { editing: value } })
}

const publishArticle = () => {
  article.value.publishing_state = 'pbsh'
  updateArticle(article.value.id, article.value)
}

const debouncedUpdateArticle = (id, newArticle) => {
  clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    try {
      await updateArticle(id, newArticle)
    } catch (error) {
      console.log('An error : ', error)
    }
  }, 2000)
}

const debouncedUpdateArticleContent = (newArticleContent) => {
  if (newArticleContent == '\n') return
  debouncedUpdateArticle(toRefs(props).id.value, { ...article.value, content: newArticleContent })
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

onMounted(async () => {
  article.value = await getArticle(props.id)
  comments.value = await getCommentsForArticle(props.id)
  const editing = route.query.editing
  editingMetaData.value = editing === 'false' ? false : !!editing
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
