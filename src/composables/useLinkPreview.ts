import { fetchWrapper } from '@/helpers'

async function postLinkPreview(payload: any): Promise<any> {
  const response = await fetchWrapper.post('/link_preview', payload)
  return response.data
}

export function useLinkPreview() {
  return {
    postLinkPreview
  }
}
