<template>
  <div v-if="!mounted">
    <span>{{ fullText }}</span>
  </div>
  <div
    v-else
    class="relative p-4"
    tabindex="0"
    @keydown="handleWrite"
    @keyup="handleRelease"
    @click="menuOpen = false"
  >
    <ClipboardIcon
      @click="copyText"
      class="absolute h-6 right-2"
      :class="{ 'text-slate-400': textCopied }"
    />
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
          <div class="flex flex-wrap flex-1">
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
            <div
              class="flex-1"
              @click="selectCursorPosition(line.words.slice(-1)[0].text.slice(-1)[0])"
            />
          </div>
          <div v-if="comments.length > 0" class="absolute h-full" style="right: -2%; width: 27%">
            <CommentCard
              v-for="(comment, cindex) in line.comments"
              :key="cindex"
              class="w-full"
              v-model="comment.content"
              :editing="comment.editing"
              @validate="comment.editing = false"
              :author="comment.author"
              :created-at="comment.created_at"
            />
          </div>
        </div>
      </div>
      <div v-if="comments.length > 0" style="width: 33%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentCard from '@/components/Comment/CommentCard.vue'
import { ClipboardIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, watch, toRefs } from 'vue'
import { useComments } from '@/composables/useComments'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import { type Comment } from '@/types/models'

const emit = defineEmits(['change', 'changeComments'])

const props = withDefaults(
  defineProps<{
    resourceId?: string
    fullText: string
    extComments?: Comment[]
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
  comment?: Comment
}

interface Line {
  id: number
  words: { id: number; text: Char[] }[]
  comments: Comment[]
  lineStyle?: string | null
}

/******************* Manage cursor **********************/
const selectCursorPosition = (letter: Char) => {
  console.log('selectCursorPosition letter : ', letter)
  if (props.editable) currentCursorPosition.value = { id: letter.id, char: letter.char }
}
const currentCursorPosition = ref<Char | null>(null)

/******************** Manage text ***********************/

const text = ref<Char[]>([]) // main data, list of single cars

const lines = ref<Line[]>([])

const initLines = async () => {
  let lines: Line[] = [{ id: 0, words: [{ id: 0, text: [] }], comments: [] }]
  let linesIndex = 0
  let wordsIndex = 0
  for (var i = 0; i < text.value.length; i++) {
    if (text.value[i].char == '\n') {
      linesIndex += 1
      wordsIndex = 0
      lines.push({
        id: linesIndex,
        words: [{ id: 0, text: [] }],
        lineStyle: i < text.value.length - 1 ? text.value[i + 1].char : null,
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
      lines[linesIndex].words.push({ id: wordsIndex, text: [] })
    }
  }
  return lines
}

const moveCommentsAfterTextChange = (offset: number) => {
  if (offset == 1) {
    comments.value.forEach((comment) => {
      if (currentCursorPosition.value && comment.start_index > currentCursorPosition.value.id)
        comment.start_index += 1
      if (currentCursorPosition.value && comment.end_index > currentCursorPosition.value.id)
        comment.end_index += 1
    })
  } else if (offset == -1) {
    comments.value.forEach((comment) => {
      if (currentCursorPosition.value && comment.start_index >= currentCursorPosition.value.id)
        comment.start_index -= 1
      if (currentCursorPosition.value && comment.end_index >= currentCursorPosition.value.id)
        comment.end_index -= 1
    })
  }
}

const insertChar = (key: any) => {
  if (!currentCursorPosition.value) return
  text.value
    .filter((letter) => {
      return currentCursorPosition.value && letter.id >= currentCursorPosition.value.id + 1
    })
    .forEach((letter) => (letter.id += 1))
  text.value.splice(currentCursorPosition.value.id + 1, 0, {
    id: currentCursorPosition.value.id + 1,
    char: key
  })
  moveCommentsAfterTextChange(1)
  currentCursorPosition.value.id += 1
}

const handleWrite = (event: any) => {
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
      .filter((letter) => currentCursorPosition.value && letter.id > currentCursorPosition.value.id)
      .forEach((letter) => (letter.id -= 1))
    moveCommentsAfterTextChange(-1)
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

const handleRelease = (event: any) => {
  if (event.key == 'Control') isControlOn.value = false
}

const textCopied = ref<boolean>(false)

const { launchSnackbar } = useSnackbar()
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(props.fullText)
    textCopied.value = true
    launchSnackbar('Text copied to clipboard', 'success')
    setTimeout(() => (textCopied.value = false), 2000)
  } catch (err) {
    console.log(`Error with copy : ${err}`)
  }
}

/***************** Comments **********************/

const { createComment, batchUpdateComments } = useComments()

const comments = ref<Comment[]>([])
const debouncedEditCommentTimeout = ref<number | null>(null)

const loadComments = (extComments: Comment[]) => {
  comments.value = extComments.filter((comment) => {
    return comment.start_index != null
  })
}

const addComment = async () => {
  console.log('Add Comment')
  console.log(props.resourceId)
  console.log(menuIndex.value)
  if (!props.resourceId || !menuIndex.value) return
  console.log('Add Comment 2')
  const newComment = await createComment(props.resourceId, menuIndex.value)
  comments.value.push(newComment)
}

watch(
  comments,
  (comments) => {
    console.log('Watch comments triggered : ', comments)
    if (mounted.value) {
      console.log('Comments : ', comments)
      emit('changeComments', comments)
      if (debouncedEditCommentTimeout.value !== null)
        clearTimeout(debouncedEditCommentTimeout.value)
      debouncedEditCommentTimeout.value = setTimeout(() => batchUpdateComments(comments), 1000)
    }
  },
  { deep: true }
)

watch(toRefs(props).extComments, (extComments) => {
  loadComments(extComments)
})

/*****************  Manage dropdown menu ******************/
const menuOpen = ref(false)
const menuIndex = ref<number | null>(null)

const menuStyle = ref({
  position: 'absolute' as 'absolute',
  'z-index': 90,
  top: '0px',
  left: '0px',
  height: '106px',
  width: '260px'
})

const { user } = useUser()

const rightClick = (event: any, index: number) => {
  event.preventDefault()
  if (!user.value) return
  currentCursorPosition.value = null
  menuStyle.value.top = `${event.layerY}px`
  menuStyle.value.left = `${event.layerX}px`
  menuOpen.value = true
  menuIndex.value = index
  console.log('event : ', event)
  console.log('Have a new right click')
}

/*****************  Interact with parent ******************/
const textArrayFromString = (textString: string) => {
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

const formatText = (textArray: Char[]) => {
  return textArray.reduce((resultText, char) => resultText + char.char, '')
}

const mounted = ref(false)

onMounted(async () => {
  await textArrayFromString(props.fullText)
  await loadComments(props.extComments)
  lines.value = await initLines()
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
  lines.value = initLines()
})
</script>
