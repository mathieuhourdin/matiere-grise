import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import { type Article } from '@/types/models'

export function useArticle() {
  const newArticle = () => {
    return ref<Article>({
      resource_title: '',
      resource_subtitle: '',
      resource_content: '',
      resource_comment: '',
      interaction_user_id: undefined,
      interaction_progress: 0,
      resource_maturing_state: '',
      resource_publishing_state: 'drft',
      resource_parent_id: undefined,
      resource_external_content_url: '',
      resource_image_url: '',
      resource_type: 'atcl'
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
    article.interaction_progress = Number(article.interaction_progress)
    const response = await fetchWrapper.post('/articles', article)
    return response.data
  }

  const updateArticle = async (id: string, article: Article) => {
    article.interaction_progress = Number(article.interaction_progress)
    const response = await fetchWrapper.put('/thought_outputs/' + id, article)
    return response
  }

  return { newArticle, getArticle, createArticle, updateArticle, getArticles }
}
