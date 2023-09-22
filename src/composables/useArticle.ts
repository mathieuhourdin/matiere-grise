import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'

export interface ThoughtOutput {
    title: string
    description: string
    content: string
    author_id?: string
    publishing_state: string
    output_type: string
}

export interface Article extends ThoughtOutput {
  title: string
  description: string
  content: string
  potential_improvements: string
  author_id?: string
  progress: number
  maturing_state: string
  publishing_state: string
  parent_id?: string
  gdoc_url: string
  image_url: string
  url_slug: string
  output_type: string
}

export function useArticle() {
  const newArticle = () => {
    return ref<Article>({
      title: '',
      description: '',
      content: '',
      potential_improvements: '',
      author_id: undefined,
      progress: 0,
      maturing_state: '',
      publishing_state: 'drft',
      parent_id: undefined,
      gdoc_url: '',
      image_url: '',
      url_slug: '',
      output_type: 'atcl'
    })
  }

  const getArticle = async (id: string) => {
    const response = await fetchWrapper.get('/articles/' + id)
    return response.data
  }

  const getArticles = async (params: any) => {
    const requestParams = `?author=${params.author}&drafts=${params.drafts}`
    const response = await fetchWrapper.get('/articles' + requestParams)
    return response.data
  }

  const createArticle = async (article: Article) => {
    article.progress = Number(article.progress)
    const response = await fetchWrapper.post('/articles', article)
    return response.data
  }

  const updateArticle = async (id: string, article: Article) => {
    article.progress = Number(article.progress)
    const response = await fetchWrapper.put('/thought_outputs/' + id, article)
    return response
  }

  return { newArticle, getArticle, createArticle, updateArticle, getArticles }
}
