<template>
  <div class="">
    <div :style="cursorCoordinates" class="absolute flex flex-column">
      <div class="cursor bg-blue-400" />
    </div>
    <ClipboardButton class="ml-auto h-6 w-6" :text="fullText" />
    <div id="editor-interface" tabindex="0" @keydown="(event) => keydown(event)">
      <div
        class="whitespace-pre-wrap"
        :class="{ 'font-bold': line.bold }"
        @click="setCursorPositionFromClick(index)"
        v-for="(line, index) in textLines"
        :id="`line-${componentUuid}-${index}`"
      >
        <div v-if="!line.chip">
          {{ line.text === '' ? ' ' : line.text }}
        </div>
        <li v-else class="ml-4">
          {{ line.text }}
        </li>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClipboardButton from '@/components/ClipboardButton.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useSnackbar } from '@/composables/useSnackbar'

const emit = defineEmits(['change'])

const props = defineProps<{
  text?: string
  editable?: boolean
}>()

const { launchSnackbar } = useSnackbar()

const componentUuid = ref<string>('')

const fullText = computed(() => {
  return formatText()
})

const lastKeyPress = ref<string | null>(null)

const setCursorPositionFromClick = (index) => {
  if (!props.editable) return
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  cursorPosition.value = { line: index, charRange: range.startOffset }
}

const getCursorCoordinates = () => {
  if (cursorPosition.value.line === undefined) return

  console.log(`CursorPosition : ${JSON.stringify(cursorPosition.value)}`)
  const range = document.createRange()

  const selectedLine = document.getElementById(
    `line-${componentUuid.value}-${cursorPosition.value.line}`
  )

  console.log('Selected LIne : ', selectedLine)

  const textLineHeight = window.getComputedStyle(selectedLine).lineHeight

  const textNode = selectedLine.firstChild.firstChild
  range.setStart(textNode, 0)
  range.setEnd(textNode, cursorPosition.value.charRange)

  const boundingRects = range.getClientRects()
  const lastRect = boundingRects[boundingRects.length - 1]

  cursorCoordinates.value = {
    left: `${lastRect.right}px`,
    bottom: `${lastRect.bottom}px`,
    top: `${lastRect.top - 3}px`,
    height: textLineHeight
  }
}

const insertAt = (original: string, insertion: string, index: number) => {
  return original.slice(0, index) + insertion + original.slice(index)
}

const removeAt = (original: string, index: number) => {
  return original.slice(0, index - 1) + original.slice(index)
}

const editCount = ref<number>(0)

const handleBackspace = async () => {
  if (cursorPosition.value.charRange !== 0) {
    textLines.value[cursorPosition.value.line].text = removeAt(
      textLines.value[cursorPosition.value.line].text,
      cursorPosition.value.charRange
    )
    cursorPosition.value.charRange -= 1
  } else {
    if (textLines.value[cursorPosition.value.line].chip) {
      textLines.value[cursorPosition.value.line].chip = false
      editCount.value += 1
      return
    }
    if (textLines.value[cursorPosition.value.line].chip) {
      textLines.value[cursorPosition.value.line].chip = false
      editCount.value += 1
      return
    }
    if (cursorPosition.value.line === 0) return

    await new Promise((resolve) => setTimeout(resolve, 10))
    cursorPosition.value = {
      line: cursorPosition.value.line - 1,
      charRange: textLines.value[cursorPosition.value.line - 1].text.length
    }
    textLines.value[cursorPosition.value.line].text +=
      textLines.value[cursorPosition.value.line + 1].text
    textLines.value.splice(cursorPosition.value.line + 1, 1)
  }
  editCount.value += 1
}

const handleWrite = (key: string) => {
  if (lastKeyPress.value === 'Dead') key = 'ê'
  if (key === '#' && cursorPosition.value.charRange === 0) {
    textLines.value[cursorPosition.value.line].bold = true
  } else if (key === '*' && cursorPosition.value.charRange === 0) {
    textLines.value[cursorPosition.value.line].chip = true
  } else {
    textLines.value[cursorPosition.value.line].text = insertAt(
      textLines.value[cursorPosition.value.line].text,
      key,
      cursorPosition.value.charRange
    )
    cursorPosition.value.charRange += 1
  }
  editCount.value += 1
}

const handleNewLine = async () => {
  const line = cursorPosition.value.line
  const charRange = cursorPosition.value.charRange
  const initialText = textLines.value[cursorPosition.value.line].text

  const firstNewLineText = initialText.slice(0, charRange)
  const secondNewLineText = initialText.substring(charRange, initialText.length)

  const newLine = { index: 440, text: secondNewLineText, bold: false, chip: false }

  textLines.value.splice(line + 1, 0, newLine)
  await new Promise((resolve) => setTimeout(resolve, 10))
  cursorPosition.value = { line: line + 1, charRange: 0 }
  textLines.value[line].text = firstNewLineText

  editCount.value += 1
}

const keydown = async (event) => {
  const key = event.key
  event.preventDefault()
  console.log('Keydown : ', key)

  if (key.length === 1) {
    handleWrite(key)
  } else if (key === 'Enter') {
    await handleNewLine()
  } else if (key === 'Backspace') {
    await handleBackspace()
  } else if (key === 'ArrowRight') {
    if (cursorPosition.value.charRange === textLines.value[cursorPosition.value.line].text.length) {
      cursorPosition.value = { line: cursorPosition.value.line + 1, charRange: 1 }
    } else {
      cursorPosition.value.charRange += 1
    }
  } else if (key === 'ArrowLeft') {
    if (cursorPosition.value.charRange === 0) {
      cursorPosition.value = {
        line: cursorPosition.value.line - 1,
        charRange: textLines.value[cursorPosition.value.line - 1].text.length
      }
    } else {
      cursorPosition.value.charRange -= 1
    }
  }
  lastKeyPress.value = key
}

const cursorCoordinates = ref({ left: '0px', right: '0px' })

const cursorPosition = ref({ line: undefined, charRange: undefined })

const textLines = ref([])
const parseTextLines = (text) => {
  return text.split('\n').map((text, index) => {
    let bold = false
    let chip = false
    if (text[0] === '#') {
      text = text.slice(1)
      bold = true
    }
    if (text[0] === '*') {
      text = text.slice(1)
      chip = true
    }
    return { index, text, bold, chip }
  })
}
const formatText = () => {
  return textLines.value
    .map((line) => (line.bold ? '#' : '') + (line.chip ? '*' : '') + line.text)
    .join('\n')
}
const element = ref(null)

onMounted(() => {
  componentUuid.value = uuidv4()
  textLines.value = parseTextLines(props.text)

  element.value = document.getElementById('editor-interface')
  element.focus
  element.value.addEventListener('blur', () => {
    element.value.focus()
  })
  const routerView = document.getElementById('router-view')
  routerView.addEventListener('scroll', () => {
    getCursorCoordinates()
  })
})
const debouncedUpdate = ref<number | null>(null)
const debouncedEmit = () => {
  if (debouncedUpdate.value !== null) clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    const toEmitText = formatText()
    if (toEmitText === '' || !toEmitText) {
      launchSnackbar('Try to update with empty content', 'error')
    } else {
      emit('change', formatText())
    }
  }, 1000)
}

watch(editCount, () => {
  debouncedEmit()
})
//watch(textLines, () => console.log(`textLines : ${JSON.stringify(textLines)}`), {deep: true})
watch(
  cursorPosition,
  () => {
    getCursorCoordinates()
  },
  { deep: true }
)
</script>
<style>
.cursor {
  width: 2px;
  height: 100%; /* Typical height of a text line */
  animation: blink 1s step-start 0s infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
