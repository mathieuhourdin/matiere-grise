<template>
  <div>
    <TextInterface full-text="Salut à tous c'est le texte" class="max-w-xl m-10 h-96" @change="changeText"/>
  </div>
</template>

<script setup lang="ts">
import TextInterface from "@/components/TextInterface.vue"

const changeText = (text) => {
  console.log("Changed the text: ", text);
}
</script>
