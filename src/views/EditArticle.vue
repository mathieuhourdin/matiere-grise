<template>
  <div>
    <div class="max-w-xl mt-8 mx-auto border-2 p-4">
      <div>Edition</div>
      <ArticleForm class="w-full" :article="article" @change="(event) => (article = event)" />
      <div class="flex">
        <ActionButton
          @click="triggerUpdateArticle"
          text="Valider"
          type="valid"
          class="ml-auto m-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleForm from '@/components/ArticleForm.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import router from '@/router'
import { useArticle } from '@/composables/useArticle'
import { onMounted, toRefs, watch, ref } from 'vue'

const props = defineProps<{
  id: string
}>()
const { newArticle, getArticle, updateArticle } = useArticle()
const article = newArticle()

const debouncedUpdate = ref<number | null>(null)

const triggerUpdateArticle = async () => {
  await updateArticle(toRefs(props).id.value, article.value)
  router.push('/articles/' + toRefs(props).id.value)
}

onMounted(async () => {
  article.value = await getArticle(toRefs(props).id.value)
})

watch(article, (newArticle) => {
  console.log("New article : ", newArticle);
  if (debouncedUpdate.value !== null) clearTimeout(debouncedUpdate.value);
  debouncedUpdate.value = setTimeout(async () => {
    await updateArticle(toRefs(props).id.value, article.value)
  }, 2000);
}, { deep: true })
</script>
