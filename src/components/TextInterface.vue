<template>
  <div
    class="relative p-4"
    tabindex="0"
    @keydown="handleWrite"
    @keyup="handleRelease"
    @click="menuOpen = false"
  >
    <div class="bg-white border-4" v-if="menuOpen" :style="menuStyle">
      <div
        @click="addComment"
        class="text-sm border-b-2 flex items-center p-2"
        style="height: 50px"
      >
        Ajouter un commentaire
      </div>
      <div class="text-sm align-middle flex items-center p-2" style="height: 50px">
        Corriger une faute
      </div>
    </div>
    <div class="flex mx-auto max-w-full">
      <div class="w-full">
        <div v-for="(line, lindex) in lines" :key="lindex" class="flex">
          <div v-if="line.lineStyle == '*'" class="flex">
            <div class="w-6">
              <div class="rounded-full ml-4 mr-2 mt-2 h-1 w-1 bg-black" />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div v-for="(word, windex) in line.words" :key="windex" class="flex flex-wrap">
              <div
                v-for="(letter, tindex) in word.text"
                :key="tindex"
                class="border-blue-400"
                :class="{
                  'border-r-2': letter.id == currentCursorPosition?.id,
                  'bg-yellow-400': letter.comment
                }"
                @click="selectCursorPosition(letter)"
                @contextmenu="(event) => rightClick(event, letter.id)"
              >
                <div v-if="letter.char == ' '" style="width: 5px" />
                <div v-else-if="letter.char == '\n'" style="height: 25px" />
                <div v-else-if="(letter.char == '#' || letter.char == '*') && windex == 0"></div>
                <div v-else :class="{ 'font-bold': line.lineStyle == '#' }">
                  <div>{{ letter.char }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute h-full" style="right: -2%; width: 27%">
            <CommentCard
              v-for="(comment, cindex) in line.comments"
              :key="cindex"
              class="w-full"
              v-model="comment.content"
              :editing="comment.editing"
              @validate="comment.editing = false"
              :author="comment.author"
            />
          </div>
        </div>
      </div>
      <div v-if="comments.length > 0" style="width: 33%">Espace</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentCard from '@/components/CommentCard.vue'
import { ref, computed, onMounted, watch, toRefs } from 'vue'
import { useComments } from '@/composables/useComments.ts'

const emit = defineEmits(['change', 'changeComments'])

const props = withDefaults(
  defineProps<{
    ressourceId: string
    fullText: string
    extComments?: Array
    editable?: boolean
  }>(),
  {
    editable: true,
    extComments: () => []
  }
)

interface Char {
  id: number
  char: string
}

interface Line {
  startIndex: number
  text: [Char]
}

/******************* Manage cursor **********************/
const selectCursorPosition = (letter) => {
  console.log('selectCursorPosition letter : ', letter)
  if (props.editable) currentCursorPosition.value = { id: letter.id, char: letter.char }
}
const currentCursorPosition = ref(null)

/******************** Manage text ***********************/

const text: [Char] = ref([]) // main data, list of single cars

const lines: [Line] = computed(() => {
  return calculateLinesFromText(text.value)
})

const calculateLinesFromText = (textString) => {
  console.log('textArrayFromString textString: ', textString)
  let lines = [{ id: 0, words: [{ id: 0, text: [] }], comments: [] }]
  let linesIndex = 0
  let wordsIndex = 0
  for (var i = 0; i < text.value.length; i++) {
    if (text.value[i].char == '\n') {
      linesIndex += 1
      wordsIndex = 0
      lines.push({
        id: linesIndex,
        words: [{ id: 0, text: [] }],
        lineStyle: (i < text.value.length -1) ? text.value[i+1].char : null,
        comments: []
      })
    }
    const foundComment = comments.value.find((comment) => comment.start_index == i)
    if (foundComment) lines[linesIndex].comments.push(foundComment)
    lines[linesIndex].words[wordsIndex].text.push({
      id: i,
      char: text.value[i].char,
      comment: foundComment
    })
    if (text.value[i].char == ' ') {
      // if space, go to next word
      wordsIndex += 1
      lines[linesIndex].words.push({ id: wordsIndex, text: [{ id: i, char: text.value[i].char }] })
    }
  }
  return lines
}

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
  comments.value.forEach((comment) => {
    if (comment.start_index > currentCursorPosition.value.id) comment.start_index += 1;
    if (comment.end_index > currentCursorPosition.value.id) comment.end_index += 1;
  });
  currentCursorPosition.value.id += 1
}

const handleWrite = (event) => {
  console.log('Writes : ', event.key)
  if (currentCursorPosition.value === null) return
  const key = event.key
  if (isControlOn.value && key == 'v') {
    pasteClipboard()
    return
  }
  if (key.length == 1) {
    event.preventDefault()
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
    if (letterIndex < text.value.length - 1) selectCursorPosition(text.value[letterIndex + 1])
  } else if (key == 'ArrowLeft') {
    let letterIndex = currentCursorPosition.value.id
    if (letterIndex > 0) selectCursorPosition(text.value[letterIndex - 1])
  } else if (key == 'Control') {
    console.log('Control')
    isControlOn.value = true
  }
}

/*************** deal with copy-paste **************/
const isControlOn = ref(false)

const pasteClipboard = async () => {
  try {
    let clippedText = await navigator.clipboard.readText()
    console.log('Clippedtext : ', clippedText)
    for (var i = 0; i < clippedText.length; i++) {
      insertChar(clippedText[i])
    }
  } catch (error) {
    console.log('Error with clippboard : ', error)
  }
}

const handleRelease = (event) => {
  if (event.key == 'Control') isControlOn.value = false
}

/***************** Comments **********************/

const { createComment, batchUpdateComments } = useComments();

const comments = ref([])
const debouncedEditCommentTimeout = ref(null);

const loadComments = (extComments) => {
  console.log('Comments loading : ', extComments)
  comments.value = extComments
}

const addComment = async () => {
  console.log('Add Comment')
  const newComment = await createComment(props.ressourceId, menuIndex.value);
  comments.value.push(newComment)
}

watch(
  comments,
  (comments) => {
    console.log('Watch comments triggered : ', comments.value)
    if (mounted.value) {
      console.log("Comments : ", comments);
      emit('changeComments', comments.value)
      clearTimeout(debouncedEditCommentTimeout.value);
      debouncedEditCommentTimeout.value = setTimeout(() => batchUpdateComments(comments), 1000);
    }
  },
  { deep: true }
)

watch(
  toRefs(props).extComments,
  (extComments) => {
    comments.value = extComments
  },
)

/*****************  Manage dropdown menu ******************/
const menuOpen = ref(false)
const menuIndex = ref(null)

const menuStyle = ref({
  position: 'absolute',
  'z-index': 90,
  top: 0,
  left: 0,
  height: '106px',
  width: '260px'
})

const rightClick = (event, index) => {
  event.preventDefault()
  currentCursorPosition.value = null
  menuStyle.value.top = `${event.layerY}px`
  menuStyle.value.left = `${event.layerX}px`
  menuOpen.value = true
  menuIndex.value = index
  console.log('event : ', event)
  console.log('Have a new right click')
}

/*****************  Interact with parent ******************/
const textArrayFromString = (textString) => {
  console.log('textArrayFromString textString: ', textString)
  text.value = []
  if (textString === undefined || textString == '') {
    text.value = [{ id: 0, char: '\n' }]
    selectCursorPosition({ id: 0, char: '\n' })
    return
  }
  for (var i = 0; i < textString.length; i++) {
    const foundComment = comments.value.find((comment) => comment.start_index == i)
    text.value.push({ id: i, char: textString[i], comment: foundComment })
  }
}

const formatText = (textArray: [Char]) => {
  return textArray.reduce((resultText, char) => resultText + char.char, '')
}

const mounted = ref(false)

onMounted(() => {
  textArrayFromString(props.fullText)
  loadComments(props.extComments)
  mounted.value = true
})

watch(
  text,
  (newText) => {
    console.log('Watch triggered : ', newText)
    if (mounted.value) emit('change', formatText(newText))
  },
  { deep: true }
)

watch(toRefs(props).fullText, (newText) => {
  textArrayFromString(newText)
})
</script>
