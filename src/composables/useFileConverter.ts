import { fetchWrapper } from '@/helpers'

const postFileConversion = async (
  file: any,
  target_format: string = 'ppdc',
  removeLineBreaks: boolean = false
) => {
  const response = await fetchWrapper.post(
    `/file_conversion?target_format=${target_format}&remove_line_breaks=${removeLineBreaks}`,
    file,
    'multipart/form-data'
  )
  return response.data
}

export function useFileConverter() {
  return {
    postFileConversion
  }
}
