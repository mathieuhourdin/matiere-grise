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
        <span v-if="!line.chip">
          {{ line.text === '' ? ' ' : line.text }}
        </span>
        <li v-else class="ml-4">
          {{ line.text }}
        </li>
      </div>
    </div>
    <RoundLinkButton
      v-if="canComment"
      class="absolute right-2 w-9"
      :style="{ top: cursorCoordinates.top }"
      @click="addComment(resourceId)"
    >
      <ChatBubbleBottomCenterTextIcon />
    </RoundLinkButton>
    <UserAvatar
      v-for="(comment, cindex) in parentComments"
      :key="cindex"
      class="absolute right-2 w-16"
      :style="{ top: comment.top }"
      :user="comment.author"
      @click="openComment(comment)"
    />
    <ModalSheet :open="commentIsOpen" @close="commentIsOpen = false">
      <div class="text-sm mb-4">Commentaire de : "...{{ openedCommentText }}..."</div>
      <CommentCard
        v-if="commentIsOpen"
        v-model="openedComment.content"
        :editing="openedComment.editing"
        @validate="openedComment.editing = false"
        @edit="openedComment.editing = true"
        :created-at="openedComment.created_at"
        :author="openedComment.author"
      />
      <CommentCard
        v-for="comment in getChildComments(comments, openedComment)"
        v-model="comment.content"
        :editing="comment.editing"
        @validate="comment.editing = false"
        @edit="comment.editing = true"
        :created-at="comment.created_at"
        :author="comment.author"
      />
      <ActionButton
        text="Répondre"
        type="valid"
        class="w-1/5"
        @click="addComment(resourceId, openedComment.id)"
      />
    </ModalSheet>
  </div>
</template>

<script setup lang="ts">
import ClipboardButton from '@/components/ClipboardButton.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import CommentCard from '@/components/Comment/CommentCard.vue'
import UserAvatar from '@/components/User/UserAvatar.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useSnackbar } from '@/composables/useSnackbar'
import { useWrite } from '@/composables/useWrite'
import { useCursor } from '@/composables/useCursor'
import { useComments } from '@/composables/useComments'
import { useTextInterfaceComments } from '@/composables/useTextInterfaceComments'
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

const {
  comments,
  canComment,
  loadComments,
  addComment,
  getCommentsTopPosition,
  openComment,
  openedComment,
  openedCommentText,
  commentIsOpen,
  debouncedEditCommentTimeout,
  getChildComments,
  getParentComments,
  parentComments
} = useTextInterfaceComments()

const { getCommentsForThoughtOutput, createComment, batchUpdateComments } = useComments()

onMounted(async () => {
  componentUuid.value = uuidv4()
  textLines.value = parseTextLines(props.text)
  const routerView = document.getElementById('router-view')
  routerView.addEventListener('scroll', () => {
    getCursorCoordinates()
    getCommentsTopPosition(comments)
  })
  comments.value = await loadComments(props.resourceId)
  getCommentsTopPosition(comments.value)
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

watch(
  comments,
  async (comments) => {
    if (debouncedEditCommentTimeout.value !== null) clearTimeout(debouncedEditCommentTimeout.value)
    debouncedEditCommentTimeout.value = setTimeout(() => batchUpdateComments(comments), 1000)
  },
  { deep: true }
)
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
.highlight {
  background-color: rgba(255, 255, 0, 0.5); /* Semi-transparent yellow */
  position: absolute;
  z-index: -1; /* Lower z-index to place it behind the text */
  pointer-events: none; /* Allow interactions to pass through */
}
</style>
