import { useCursor } from '@/composables/useCursor'
import { useWrite } from '@/composables/useWrite'
import { useComments } from '@/composables/useComments'
import { ref, computed } from 'vue'
import { type Comment } from '@/types/models'
import { v4 as uuidv4 } from 'uuid'

const { createComment, getCommentsForThoughtOutput } = useComments()
const { componentUuid, cursorPosition, getCoordinatesFromTextRange } = useCursor()
const { textLines } = useWrite()

const debouncedEditCommentTimeout = ref<number | null>(null)

const comments = ref<Comment[]>([])

const openedComment = ref<Comment | null>(null)

const getChildComments = (comments: any[], parentComment: any) => {
  return comments
    .filter((comment: any) => comment.parent_id === parentComment.id)
    .sort((a: any, b: any) => a.created_at - b.created_at)
}

const getParentComments = (comments: any[]) => {
  console.log('getParentComments : ', comments)
  return comments.filter((comment: any) => comment.parent_id === null)
}

const parentComments = computed(() => {
  return getParentComments(comments.value)
})

const openedCommentText = computed(() => {
  if (
    !commentIsOpen ||
    !openedComment.value ||
    openedComment.value.line === undefined ||
    openedComment.value.startOffset === undefined ||
    openedComment.value.endOffset === undefined
  )
    return
  return textLines.value[openedComment.value.line].text.slice(
    openedComment.value.startOffset,
    openedComment.value.endOffset
  )
})

const openComment = (comment: Comment) => {
  console.log('openComment')
  openedComment.value = comment
  commentIsOpen.value = true
}
const commentIsOpen = ref<boolean>(false)

const canComment = computed(() => {
  if (!cursorPosition.value) return
  return cursorPosition.value.startOffset < cursorPosition.value.endOffset
})

const addComment = async (resourceId: string, parentId: string | null = null) => {
  let start_index
  let end_index
  if (!cursorPosition.value && parentId) {
    start_index = null
    end_index = null
  } else if (cursorPosition.value && !parentId) {
    let lineSize = 0
    console.log('CursorPosition : ', cursorPosition.value)
    for (let i = 0; i++; i <= cursorPosition.value.line) {
      console.log("LineIndex : ", i)
      console.log("LineLength : ", getLineLength(i))
      lineSize += getLineLength(i)
    }
    start_index = lineSize + cursorPosition.value.startOffset
    end_index = lineSize + cursorPosition.value.endOffset
  } else {
    return
  }
  await createComment(resourceId, start_index, end_index, '', true, parentId)
  const newComments = await loadComments(resourceId)
  comments.value.forEach((comment: Comment) => {
    removeCommentHighlighting(comment)
  })
  comments.value = newComments
  getCommentsTopPosition()
}
const loadComments = async (resourceId: string) => {
  const comments = await getCommentsForThoughtOutput(resourceId)
  return comments.map((comment) => {
    comment.highlights = []
    return findCommentLineAndOffset(comment)
  })
}

const getLineLength = (lineIndex: number) => {
  return (
    textLines.value[lineIndex].text.length +
    Number(textLines.value[lineIndex].bold || textLines.value[lineIndex].chip)

  )
}

const getCommentTopPosition = (comment: any) => {
  const coordinates = getCoordinatesFromTextRange(comment)
  if (!coordinates) return
  return coordinates.top
}

const getWindowRangeFromCursorRange = (comment: any) => {
  const range = document.createRange()
  const selectedLine = document.getElementById(`line-${componentUuid.value}-${comment.line}`)
  if (!selectedLine) return
  const textLineHeight = window.getComputedStyle(selectedLine).lineHeight
  if (!selectedLine.firstChild) return
  const textNode = selectedLine.firstChild.firstChild
  if (!textNode) return
  try {
    range.setStart(textNode, comment.startOffset)
    range.setEnd(textNode, comment.endOffset)
  } catch (error) {
    console.log('getWindowRangeFromCursorRange error in set range : ', error)
  }
  return range
}

const removeCommentHighlighting = (comment: Comment) => {
  if (!comment.highlights) return
  comment.highlights.forEach((highlight: string) => {
    const element = document.getElementById(highlight)
    if (element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  })
}

const highlitghtComment = (comment: any) => {
  const range = getWindowRangeFromCursorRange(comment)
  if (!range) return
  const rects = range.getClientRects()
  removeCommentHighlighting(comment)
  Array.from(rects).forEach((rect: any) => {
    const highlightDiv = document.createElement('div')
    const divUuid = uuidv4()
    highlightDiv.id = divUuid
    highlightDiv.className = 'highlight'
    highlightDiv.style.top = `${rect.top + window.scrollY}px`
    highlightDiv.style.left = `${rect.left + window.scrollX}px`
    highlightDiv.style.width = `${rect.width}px`
    highlightDiv.style.height = `${rect.height}px`

    document.body.appendChild(highlightDiv)
    comment.highlights.push(divUuid)
  })
}

const getCommentsTopPosition = () => {
  comments.value = comments.value.map((comment) => {
    comment.top = getCommentTopPosition(comment)
    highlitghtComment(comment)
    return comment
  })
}

const findCommentLineAndOffset = (comment: any) => {
  let counter = 0
  let lineIndex = 0
  let lastLineCount = getLineLength(0)
  while (counter + lastLineCount < comment.start_index) {
    counter += lastLineCount + 1
    lastLineCount = getLineLength(lineIndex)
    if (lineIndex >= textLines.value.length) {
      break
    }
    lineIndex += 1
  }
  const commentLine = lineIndex + 1
  const startOffset = comment.start_index - counter
  const endOffset = comment.end_index - counter
  return { ...comment, line: commentLine, startOffset: startOffset, endOffset: endOffset }
}

export function useTextInterfaceComments() {
  return {
    canComment,
    addComment,
    comments,
    loadComments,
    getCommentsTopPosition,
    openComment,
    openedComment,
    commentIsOpen,
    openedCommentText,
    debouncedEditCommentTimeout,
    getChildComments,
    getParentComments,
    parentComments
  }
}
