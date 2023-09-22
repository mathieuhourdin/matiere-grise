<template>
  <div>
    <TextInterface
      :ext-comments="comments"
      :full-text="text"
      class="max-w-xl m-10 h-96"
      @change="changeText"
    />
  </div>
</template>

<script setup lang="ts">
import TextInterface from '@/components/TextInterface.vue'
import { type Comment } from '@/types/models'
import { ref } from "vue"

const text = ref("Salut à tous c'est le texte")
const comments = ref<Comment[]>([])

const changeComments = (updatedComments: Comment[]) => {
  comments.value = updatedComments;
}

const changeText = (text: string) => {
  console.log('Changed the text: ', text)
}
</script>
