<template>
  <div class="">
    <div :style="cursorCoordinates" class="absolute flex flex-column">
      <div class="cursor bg-blue-400" />
    </div>
    <ClipboardButton class="ml-auto h-6 w-6" :text="text" />
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
    <RoundLinkButton
      v-if="canComment"
      class="absolute right-2 w-9"
      :style="{ top: cursorCoordinates.top }"
      @click="addComment"
    >
      <ChatBubbleBottomCenterTextIcon />
    </RoundLinkButton>
  </div>
</template>

<script setup lang="ts">
import ClipboardButton from '@/components/ClipboardButton.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useSnackbar } from '@/composables/useSnackbar'
import { useWrite } from '@/composables/useWrite'
import { useCursor } from '@/composables/useCursor'
import { useComments } from '@/composables/useComments'
import { type Comment } from '@/types/models'

const emit = defineEmits(['change'])

const props = defineProps<{
  resourceId?: string
  text?: string
  editable?: boolean
}>()

const { launchSnackbar } = useSnackbar()

const { formatText, textLines, keydown, editCount, parseTextLines } = useWrite()

const {
  getCursorCoordinates,
  cursorPosition,
  cursorCoordinates,
  componentUuid,
  handleKeydown,
  mouseupHandler,
  setCursorPositionFromClick
} = useCursor()

const canComment = computed(() => {
  if (!cursorPosition.value) return
  return cursorPosition.value.startOffset < cursorPosition.value.endOffset
})

const { getCommentsForThoughtOutput, createComment, batchUpdateComments } = useComments()

const comments = ref<Comment[]>([])
const addComment = async () => {
  createComment(props.resourceId, cursorPosition.value.startOffset, cursorPosition.value.endOffset)
}
const openComment = () => {
  console.log('OpenComment')
}
const loadComments = async () => {
  const comments = await getCommentsForThoughtOutput(props.resourceId)
  comments.map((comment) => {
    return findCommentLineAndOffset(comment)
  })
}

const findCommentLineAndOffset = (comment) => {
  let counter = 0
  let lineIndex = 0
  while (counter < comment.startIndex) {
    counter +=
      textLines.value[lineIndex].text.length + textLines.value[lineIndex].bold ||
      textLines.value[lineIndex].italic
    if (lineIndex >= textLines.value.length) {
      break;
    }
    lineIndex += 1
  }
}

onMounted(async () => {
  componentUuid.value = uuidv4()
  textLines.value = parseTextLines(props.text)
  const routerView = document.getElementById('router-view')
  routerView.addEventListener('scroll', () => {
    getCursorCoordinates()
  })
  comments.value = await getCommentsForThoughtOutput(props.resourceId)
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
