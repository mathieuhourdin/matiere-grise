import { ref, type Ref } from 'vue'

export type Cursor = {
  line: number
  startOffset: number
  endOffset: number
}

type Line = {
  index: number
  text: string
  bold: boolean
  chip: boolean
}

const textLines = ref<Line[]>([])
const lastKeyPress = ref<string | null>(null)

const insertAt = (original: string, insertion: string, index: number) => {
  return original.slice(0, index) + insertion + original.slice(index)
}

const removeAt = (original: string, index: number) => {
  return original.slice(0, index - 1) + original.slice(index)
}

const editCount = ref<number>(0)

const handleBackspace = async (cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  if (cursorPosition.value.startOffset !== 0) {
    textLines.value[cursorPosition.value.line].text = removeAt(
      textLines.value[cursorPosition.value.line].text,
      cursorPosition.value.startOffset
    )
    cursorPosition.value.startOffset -= 1
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
      startOffset: textLines.value[cursorPosition.value.line - 1].text.length,
      endOffset: textLines.value[cursorPosition.value.line - 1].text.length
    }
    textLines.value[cursorPosition.value.line].text +=
      textLines.value[cursorPosition.value.line + 1].text
    textLines.value.splice(cursorPosition.value.line + 1, 1)
  }
  editCount.value += 1
}

const handleWrite = async (key: string, cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  if (lastKeyPress.value === 'Dead') {
    switch (key) {
      case 'e':
        key = 'ê'
        break
      case 'o':
        key = 'ô'
        break
      case 'a':
        key = 'â'
        break
      case 'u':
        key = 'û'
        break
    }
  }
  if (key === '#' && cursorPosition.value.startOffset === 0) {
    textLines.value[cursorPosition.value.line].bold = true
  } else if (key === '*' && cursorPosition.value.startOffset === 0) {
    textLines.value[cursorPosition.value.line].chip = true
  } else {
    textLines.value[cursorPosition.value.line].text = insertAt(
      textLines.value[cursorPosition.value.line].text,
      key,
      cursorPosition.value.startOffset
    )
    await new Promise((resolve) => setTimeout(resolve, 1))
    cursorPosition.value.startOffset += 1
  }
  editCount.value += 1
}

const handleNewLine = async (cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  const line = cursorPosition.value.line
  const startOffset = cursorPosition.value.startOffset
  const initialText = textLines.value[cursorPosition.value.line].text

  const firstNewLineText = initialText.slice(0, startOffset)
  const secondNewLineText = initialText.substring(startOffset, initialText.length)

  const newLine = { index: 440, text: secondNewLineText, bold: false, chip: false }

  textLines.value.splice(line + 1, 0, newLine)
  await new Promise((resolve) => setTimeout(resolve, 10))
  cursorPosition.value = { line: line + 1, startOffset: 0, endOffset: 0 }
  textLines.value[line].text = firstNewLineText

  editCount.value += 1
}

const localClipboard = ref<string>('')
const copyToClipboard = (cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  const copiedText = textLines.value[cursorPosition.value.line].text.slice(
    cursorPosition.value.startOffset,
    cursorPosition.value.endOffset
  )
  localClipboard.value = copiedText
  console.log('CopiedText : ', copiedText)
}
const cutToClipboard = (cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  copyToClipboard(cursorPosition)
  const initialText = textLines.value[cursorPosition.value.line].text
  const initalEndOffset = cursorPosition.value.endOffset
  cursorPosition.value.endOffset = cursorPosition.value.endOffset
  textLines.value[cursorPosition.value.line].text =
    initialText.slice(0, cursorPosition.value.startOffset) + initialText.slice(initalEndOffset)
}
const pasteTextFromClipboard = (cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  textLines.value[cursorPosition.value.line].text = insertAt(
    textLines.value[cursorPosition.value.line].text,
    localClipboard.value,
    cursorPosition.value.startOffset
  )
  cursorPosition.value.startOffset += localClipboard.value.length
  cursorPosition.value.endOffset = cursorPosition.value.startOffset
}

const keydown = async (event: any, cursorPosition: Ref<Cursor|null>) => {
  if (!cursorPosition.value) return
  const key = event.key
  event.preventDefault()
  console.log('Keydown : ', key)

  if (key === 'c' && lastKeyPress.value === 'Control') {
    copyToClipboard(cursorPosition)
    lastKeyPress.value = key
    return
  }
  if (key === 'x' && lastKeyPress.value === 'Control') {
    cutToClipboard(cursorPosition)
    lastKeyPress.value = key
    return
  }

  if (key === 'v' && lastKeyPress.value === 'Control') {
    pasteTextFromClipboard(cursorPosition)
    lastKeyPress.value = key
    return
  }

  if (key.length === 1) {
    await handleWrite(key, cursorPosition)
  } else if (key === 'Enter') {
    await handleNewLine(cursorPosition)
  } else if (key === 'Backspace') {
    await handleBackspace(cursorPosition)
  } else if (key === 'ArrowRight') {
    if (
      cursorPosition.value.startOffset === textLines.value[cursorPosition.value.line].text.length
    ) {
      cursorPosition.value = { line: cursorPosition.value.line + 1, startOffset: 1, endOffset: 1 }
    } else {
      cursorPosition.value.startOffset += 1
    }
  } else if (key === 'ArrowLeft') {
    if (cursorPosition.value.startOffset === 0) {
      cursorPosition.value = {
        line: cursorPosition.value.line - 1,
        startOffset: textLines.value[cursorPosition.value.line - 1].text.length,
        endOffset: textLines.value[cursorPosition.value.line - 1].text.length
      }
    } else {
      cursorPosition.value.startOffset -= 1
    }
  }
  lastKeyPress.value = key
}

const parseTextLines = (text: string) => {
  return text.split('\n').map((text: string, index: number) => {
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

export function useWrite() {
  return {
    textLines,
    keydown,
    editCount,
    parseTextLines,
    formatText
  }
}
