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
import { ref } from "vue"

const text = ref("Salut à tous c'est le texte")
const comments = ref([])

const changeComments = (comments) => {
  comments.value = comments;
}

const changeText = (text) => {
  console.log('Changed the text: ', text)
}
</script>
