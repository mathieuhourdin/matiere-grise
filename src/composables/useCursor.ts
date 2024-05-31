import { ref } from 'vue'
import { useWrite, type Cursor } from '@/composables/useWrite'

const { keydown } = useWrite()

type CursorPosition = {
  line: number
  startOffset: number
  endOffset: number
}

const componentUuid = ref<string>('')

const mouseupHandler = (event: any) => {
  console.log(event)
  const selection = window.getSelection()
  if (!selection) return
  console.log('selection : ', selection)
  const range = selection.getRangeAt(0)
  console.log('range : ', range)
}

const setCursorPositionFromClick = (index: number) => {
  const selection = window.getSelection()
  if (!selection) return
  console.log('Selection : ', selection)
  const range = selection.getRangeAt(0)
  cursorPosition.value = { line: index, startOffset: range.startOffset, endOffset: range.endOffset }
}

const getCoordinatesFromTextRange = (textRange: CursorPosition) => {
  const range = document.createRange()
  const selectedLine = document.getElementById(`line-${componentUuid.value}-${textRange.line}`)
  if (!selectedLine) return
  const textLineHeight = window.getComputedStyle(selectedLine).lineHeight
  if (!selectedLine.firstChild) return
  const textNode = selectedLine.firstChild.firstChild
  if (!textNode) return
  console.log(textRange.startOffset)
  console.log(textRange.endOffset)
  try {
    range.setStart(textNode, textRange.startOffset)
    range.setEnd(textNode, textRange.endOffset)
  } catch {
    return
  }

  const boundingRects = range.getClientRects()
  const lastRect = boundingRects[boundingRects.length - 1]

  return {
    left: `${lastRect.right}px`,
    bottom: `${lastRect.bottom}px`,
    top: `${lastRect.top - 3}px`,
    height: textLineHeight
  }
}

const getCursorCoordinates = () => {
  if (!cursorPosition.value) return

  const tempCursorCoordinates = getCoordinatesFromTextRange({
    line: cursorPosition.value.line,
    startOffset: 0,
    endOffset: cursorPosition.value.startOffset
  })

  if (!tempCursorCoordinates) return

  cursorCoordinates.value = tempCursorCoordinates

  /*console.log(`CursorPosition : ${JSON.stringify(cursorPosition.value)}`)
  const range = document.createRange()

  const selectedLine = document.getElementById(
    `line-${componentUuid.value}-${cursorPosition.value.line}`
  )

  console.log('Selected LIne : ', selectedLine)
  if (!selectedLine) return

  const textLineHeight = window.getComputedStyle(selectedLine).lineHeight

  if (!selectedLine.firstChild) return
  const textNode = selectedLine.firstChild.firstChild

  if (!textNode) return
  range.setStart(textNode, 0)

  if (!cursorPosition.value.startOffset) return
  range.setEnd(textNode, cursorPosition.value.startOffset)

  const boundingRects = range.getClientRects()
  const lastRect = boundingRects[boundingRects.length - 1]

  cursorCoordinates.value = {
    left: `${lastRect.right}px`,
    bottom: `${lastRect.bottom}px`,
    top: `${lastRect.top - 3}px`,
    height: textLineHeight
  }*/
}

const handleKeydown = (event: any) => {
  if (!cursorPosition.value) return
  keydown(event, cursorPosition)
}

const cursorCoordinates = ref({ left: '0px', bottom: '0px', top: '0px', height: '0px' })

const cursorPosition = ref<CursorPosition | null>(null)

export function useCursor() {
  return {
    componentUuid,
    cursorPosition,
    cursorCoordinates,
    mouseupHandler,
    handleKeydown,
    getCursorCoordinates,
    setCursorPositionFromClick,
    getCoordinatesFromTextRange
  }
}
