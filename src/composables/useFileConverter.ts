import { fetchWrapper } from '@/helpers'

const postFileConversion = async (file: any) => {
  const response = await fetchWrapper.post('/file_conversion', file, 'multipart/form-data')
  return response.data
}

export function useFileConverter() {
  return {
    postFileConversion
  }
}
