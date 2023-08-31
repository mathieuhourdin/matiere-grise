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
      class="flex flex-wrap w-full"
    >
        <div
          v-for="(letter, tindex) in line.text"
          :key="tindex"
          class="border-blue-400"
          :class="{ 'border-r-2': letter.id == currentCursorPosition?.id }"
          @click="(event) => selectCursorPosition(event, letter)"
        >
          <div v-if="letter.char == ' '" style="width: 5px" />
          <div v-else-if="letter.char =='\n'" style="height: 25px" />
          <div v-else>
            <div>{{ letter.char }}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const lines = computed(() => {
  console.log("Compute lines");
  let ids = [{id: 0}].concat(text.value.filter((char) => char.char == "\n"));
  console.log("Compute ids.length : ", ids.length);
  for (let i = 0; i < ids.length -1; i++) {
    console.log("Compute line : ", i)
    ids[i].text = text.value.filter((char) => char.id >= ids[i].id && char.id < ids[i+1].id);
  }
  ids[ids.length -1].text = text.value.filter((char) => char.id >= ids[ids.length -1].id);
  return ids;
})

const text = ref([
  { id: 0, char: 'M', line: 0 },
  { id: 1, char: 'a', line: 0 }
])

const selectCursorPosition = (event, letter) => {
  console.log('selectCursorPosition letter : ', letter)
  currentCursorPosition.value = { id: letter.id, line: letter.line, char: letter.char }
}
const currentCursorPosition = ref(null)

const insertChar = (key) => {
  text.value
    .filter((letter) => {
      return letter.id >= currentCursorPosition.value.id + 1
    })
    .forEach((letter) => (letter.id += 1))
  text.value.splice(currentCursorPosition.value.id + 1, 0, {
    id: currentCursorPosition.value.id + 1,
    char: key,
    line: 0
  })
  currentCursorPosition.value.id += 1
}

const handleWrite = (event) => {
  console.log('Writes : ', event.key)
  if (currentCursorPosition.value === null) return
  const key = event.key
  if (key.length == 1) {
    insertChar(key);
  } else if (key == 'Backspace') {
    text.value.splice(currentCursorPosition.value.id, 1)
    text.value
      .filter((letter) => letter.id > currentCursorPosition.value.id)
      .forEach((letter) => (letter.id -= 1))
    currentCursorPosition.value.id -= 1
  } else if (key == 'Enter') {
    insertChar("\n");
  }
}
</script>
