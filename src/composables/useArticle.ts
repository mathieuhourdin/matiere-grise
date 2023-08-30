import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'

export interface Article {
  title: string
  description: string
  content: string
  potential_improvements: string
  author_id?: string
  progress: number
  maturing_state: string
  parent_id?: string
  gdoc_url: string
  image_url: string
  url_slug: string
}

export function useArticle() {
  const newArticle = () => {
    return ref<Article>({
      title: '',
      description: '',
      content: '',
      potential_improvements: '',
      progress: 0,
      maturing_state: '',
      gdoc_url: '',
      image_url: '',
      url_slug: ''
    })
  }

  

  const createArticle = async (article: Article) => {
      const response = await fetchWrapper.post('/articles', article)
      return response;
  }

  return { newArticle, createArticle }
}