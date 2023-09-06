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
      maturing_state: 'drft',
      gdoc_url: '',
      image_url: '',
      url_slug: ''
    })
  }

  const getArticle = async (id: string) => {
    const response = await fetchWrapper.get('/articles/' + id)
    return response.data
  }

  const getArticles = async (withUsers: boolean = true) => {
    const userParams = withUsers ? '?author=true' : ''
    const response = await fetchWrapper.get('/articles' + userParams)
    return response.data
  }

  const createArticle = async (article: Article) => {
    article.progress = Number(article.progress)
    const response = await fetchWrapper.post('/articles', article)
    return response.data
  }

  const updateArticle = async (id: string, article: Article) => {
    article.progress = Number(article.progress)
    const response = await fetchWrapper.put('/articles/' + id, article)
    return response
  }

  return { newArticle, getArticle, createArticle, updateArticle, getArticles }
}
