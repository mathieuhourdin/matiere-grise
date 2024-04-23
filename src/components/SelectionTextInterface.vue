<template>
  <div class="">
    <div :style="cursorCoordinates" class="absolute flex flex-column">
      <div class="cursor bg-blue-400" />
    </div>
    <input
      id="hidden-input"
      class="absolute"
      :style="{ top: cursorCoordinates.top, left: '99999999px' }"
    />
    <ClipboardButton class="ml-auto h-6 w-6" :text="fullText" />
    <div id="editor-interface" tabindex="0" @keydown="(event) => handleKeydown(event)">
      <div
        class="whitespace-pre-wrap"
        :class="{ 'font-bold': line.bold }"
        @click="setCursorPositionFromClick(index)"
        @mouseup="mouseupHandler"
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
import { useWrite } from '@/composables/useWrite'

const emit = defineEmits(['change'])

const props = defineProps<{
  text?: string
  editable?: boolean
}>()

const { launchSnackbar } = useSnackbar()

const { textLines, keydown, editCount } = useWrite()

const componentUuid = ref<string>('')

const fullText = computed(() => {
  return formatText()
})

const launchHiddenInput = () => {
  console.log('Trigger launchHiddenInput')
  var hiddenInput = document.getElementById('hidden-input')
  hiddenInput.style.opacity = '1' // Make the input field visible when interacting (optional)
  hiddenInput.focus() // Focus on the hidden input to trigger the keyboard
  setTimeout(() => {
    hiddenInput.style.opacity = '0' // Hide again after clicking (optional)
  }, 50)
}

const mouseupHandler = (event) => {
  console.log(event)
  const selection = window.getSelection()
  console.log('selection : ', selection)
  const range = selection.getRangeAt(0)
  console.log('range : ', range)
}

const setCursorPositionFromClick = (index) => {
  if (!props.editable) return
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  cursorPosition.value = { line: index, startOffset: range.startOffset, endOffset: range.endOffset }
  launchHiddenInput()
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
  range.setEnd(textNode, cursorPosition.value.startOffset)

  const boundingRects = range.getClientRects()
  const lastRect = boundingRects[boundingRects.length - 1]

  cursorCoordinates.value = {
    left: `${lastRect.right}px`,
    bottom: `${lastRect.bottom}px`,
    top: `${lastRect.top - 3}px`,
    height: textLineHeight
  }
}

const handleKeydown = (event) => {
  keydown(event, cursorPosition)
}

const cursorCoordinates = ref({ left: '0px', right: '0px' })

const cursorPosition = ref({ line: undefined, startOffset: undefined, endOffset: undefined })

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

onMounted(() => {
  componentUuid.value = uuidv4()
  textLines.value = parseTextLines(props.text)
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
