<template>
  <div
    class="border-2 mx-auto relative p-4"
    tabindex="0"
    @keydown="handleWrite"
    @click="menuOpen = false"
  >
  <div class="bg-white border-4" v-if="menuOpen" :style="menuStyle" ></div>
    <div
      v-for="(line, lindex) in lines"
      :key="lindex"
      class="flex flex-wrap w-full"
    >
      <div
        v-for="(letter, tindex) in line.text"
        :key="tindex"
        class="border-blue-400"
        :class="{ 'border-r-2': letter.id == currentCursorPosition?.id }"
        @click="selectCursorPosition(letter)"
        @contextmenu="rightClick"
      >
        <div v-if="letter.char == ' '" style="width: 5px" />
        <div v-else-if="letter.char == '\n'" style="height: 25px" />
        <div v-else>
          <div>{{ letter.char }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, toRefs } from 'vue'

const emit = defineEmits(['change'])

const props = defineProps<{
  fullText: string
}>()

interface Char {
  id: number
  char: string
}

interface Line {
  startIndex: number
  text: [Char]
}

const textArrayFromString = (textString) => {
  console.log("textArrayFromString textString: ", textString);
  text.value = []
  if (textString === undefined || textString == "") {
    text.value = [{id: 0, char: "\n"}];
    selectCursorPosition(null, { id: 0, char: "\n" });
    return;
  }
  for (var i = 0; i < textString.length; i++) {
    text.value.push({ id: i, char: textString[i] })
  }
}

const lines: [Line] = computed(() => {
  console.log('Compute lines')
  let ids = [{ id: 0, text: [] }].concat(text.value.filter((char) => char.char == '\n'))
  console.log('Compute ids.length : ', ids.length)
  for (let i = 0; i < ids.length - 1; i++) {
    console.log('Compute line : ', i)
    ids[i].text = text.value.filter((char) => char.id >= ids[i].id && char.id < ids[i + 1].id)
  }
  ids[ids.length - 1].text = text.value.filter((char) => char.id >= ids[ids.length - 1].id)
  return ids
})

const text: [Char] = ref([])

const selectCursorPosition = (letter) => {
  console.log('selectCursorPosition letter : ', letter)
  currentCursorPosition.value = { id: letter.id, char: letter.char }
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
    insertChar(key)
  } else if (key == 'Backspace') {
    text.value.splice(currentCursorPosition.value.id, 1)
    text.value
      .filter((letter) => letter.id > currentCursorPosition.value.id)
      .forEach((letter) => (letter.id -= 1))
    currentCursorPosition.value.id -= 1
  } else if (key == 'Enter') {
    insertChar('\n')
  } else if (key == 'ArrowRight') {
    let letterIndex = currentCursorPosition.value.id
    if (letterIndex < text.value.length -1) selectCursorPosition(text.value[letterIndex +1]);
  } else if (key == 'ArrowLeft') {
    let letterIndex = currentCursorPosition.value.id
    if (letterIndex > 0) selectCursorPosition(text.value[letterIndex -1]);
  }
}

const formatText = (textArray: [Char]) => {
  return textArray.reduce((resultText, char) => resultText + char.char, "");
};

const menuOpen = ref(false);

const menuStyle = ref({
  position: 'absolute',
  'z-index': 90,
  top: 0,
  left: 0,
  height: '100px',
  width: '150px',
});

const rightClick = (event) => {
  event.preventDefault()
  menuStyle.value.top = `${event.layerY}px`;
  menuStyle.value.left = `${event.layerX}px`;
  menuOpen.value = true;
  console.log("event : ", event);
  console.log("Have a new right click");
};

const mounted = ref(false);

onMounted(() => {
  textArrayFromString(props.fullText)
  mounted.value = true
})

watch(text, (newText) => {
  console.log("Watch triggered : ", newText);
  if (mounted.value) emit('change', formatText(newText))
}, {deep: true})

watch(toRefs(props).fullText, (newText) => {
  textArrayFromString(newText);
})
</script>
