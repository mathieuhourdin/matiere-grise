<template>
  <div
    class="border-2 h-80 mx-auto relative"
    tabindex="0"
    style="width: 800px"
    @keydown="handleWrite"
  >
    <div
      class="absolute text-center"
      style="width: 80px, height: 80px"
      :style="calculateLeftFromIndex(i)"
      v-for="(letter, i) in textArray"
      :key="i"
    >
      {{ letter }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const textArray = ref([
  'J',
  'e',
  ' ',
  'm',
  "'",
  'a',
  'p',
  'p',
  'e',
  'l',
  'l',
  'e',
  ' ',
  'M',
  'a',
  't',
  'h',
  'i',
  'e',
  'u'
])
const handleWrite = (event) => {
  console.log('Writes : ', event.key)
  const key = event.key;
  if (key.length == 1) {
    textArray.value.push(event.key)
  } else if (key == "Backspace") {
    textArray.value.pop();
  }
}
const writerWidth = 800
const letterWidth = 10
const letterHeight = 15
const lettersCountByLine = writerWidth / letterWidth
const calculateLeftFromIndex = (index) => {
  const width = `${letterWidth}px`
  const height = `${letterHeight}px`
  const top = `${letterHeight * Math.floor(index / lettersCountByLine)}px`
  const left = `${letterWidth * (index % lettersCountByLine) + 1}px`
  const fontSize = '70%'
  const padding = '0.5px'
  return { width, height, left, top, fontSize, padding }
}
</script>
