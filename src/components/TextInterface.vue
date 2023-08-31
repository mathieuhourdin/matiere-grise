<template>
  <div class="border-2 h-80 mx-auto relative" style="width: 800px">
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
const textArray = [
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
]
const writerWidth = 800;
const letterWidth = 15;
const letterHeight = 20;
const lettersCountByLine = writerWidth / letterWidth;
const calculateLeftFromIndex = (index) => {
  const width = `${letterWidth}px`;
  const height = `${letterHeight}px`;
  const top = `${letterHeight * Math.floor(index / lettersCountByLine)}px`;
  const left = `${(letterWidth * (index % lettersCountByLine)) + 1}px`;
  const fontSize = "80%";
  const padding = "0.5px";
  return { width, height, left, top, fontSize, padding };
};
</script>
