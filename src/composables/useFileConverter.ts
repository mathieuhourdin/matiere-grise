import { fetchWrapper } from '@/helpers'

const postFileConversion = async (file: any, target_format: string = "ppdc") => {
  const response = await fetchWrapper.post(`/file_conversion?target_format=${target_format}`, file, 'multipart/form-data')
  return response.data
}

export function useFileConverter() {
  return {
    postFileConversion
  }
}
