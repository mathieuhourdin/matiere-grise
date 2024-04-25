const splitTextLineForPanel = (text: string) => {
  if (!text) return []
  const splittedContent = text.replace(/\?/g, '?.').split('.')
  let i = 0
  const result = []
  while (i < splittedContent.length) {
    let size = 0
    let text = []
    if (splittedContent[i].length >= 270) {
      result.push(splittedContent[i].replace('/?./g', '?'))
      i++
    } else {
      while (i < splittedContent.length && size + splittedContent[i].length < 270) {
        text.push(splittedContent[i])
        size += splittedContent[i].length
        i++
      }
      result.push(text.join('. ').replace('/?./g', '?'))
    }
  }
  return result
}

const splitTextForPanel = (text: string) => {
  if (!text) return []
  const splittedLines = text.split('\n')
  return splittedLines.map((line: string) => splitTextLineForPanel(line)).flat()
}

export const textManagement = {
  splitTextForPanel
}
