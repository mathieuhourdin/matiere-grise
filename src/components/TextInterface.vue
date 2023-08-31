<template>
  <div
    class="border-2 h-80 mx-auto relative p-4"
    tabindex="0"
    style="width: 800px"
    @keydown="handleWrite"
  >
    <div
      v-for="(line, lindex) in lines"
      :key="lindex"
      :style="{ height: line.height }"
      class="flex"
    >
      <div :id="`field_${lindex}`" class="flex">
        <div
          v-for="(letter, tindex) in getLettersForLine(lindex)"
          :key="tindex"
          :class="{ 'border-r-4': letter.id == currentCursorPosition }"
          @click="(event) => selectCursorPosition(event, letter)"
        >
          <div v-if="letter.char == ' '" style="width: 5px" />
          <div v-else>
            <div>{{ letter.char }}</div>
          </div>
        </div>
      </div>
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
const lines = [{ height: 20 }]
const text = ref([
  { id: 0, char: 'M', line: 0 },
  { id: 1, char: 'a', line: 0 }
])
const getLineWidth = (index) => {
  console.log('Index : ', index)
  return document.getElementById(`field_${index}`).offsetWidth
}
const selectCursorPosition = (event, letter) => {
  console.log('selectCursorPosition letter : ', letter)
  currentCursorPosition.value = letter.id
}
const currentCursorPosition = ref(null)

const handleWrite = (event) => {
  console.log('Writes : ', event.key)
  if (currentCursorPosition.value === null) return
  const key = event.key
  if (key.length == 1) {
    textArray.value.push(event.key)
    text.value
      .filter((letter) => {
        return letter.id >= currentCursorPosition.value + 1
      })
      .forEach((letter) => (letter.id += 1))
    text.value.splice(currentCursorPosition.value + 1, 0, {
      id: currentCursorPosition.value + 1,
      char: event.key,
      line: 0
    })
    currentCursorPosition.value += 1
  } else if (key == 'Backspace') {
    text.value.splice(currentCursorPosition.value, 1)
    text.value
      .filter((letter) => letter.id > currentCursorPosition.value)
      .forEach((letter) => (letter.id -= 1))
    currentCursorPosition.value -= 1
    textArray.value.pop()
  }
}
const getLettersForLine = (index) => {
  console.log('getLettersForLine index : ', index)
  let letters = text.value.filter((letter) => letter.line == index)
  console.log('getted letters : ', letters)
  return letters
}
</script>
