import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import { type Article } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()

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
    try {
      const response = await fetchWrapper.get('/articles/' + id)
      return response.data
    } catch (error) {
      launchSnackbar(`Error getting article : ${error}`, 'error')
    }
  }

  const getArticles = async (params: any) => {
    try {
      const requestParams = `?author=${params.author}&drafts=${params.drafts}`
      const response = await fetchWrapper.get('/articles' + requestParams)
      return response.data
    } catch (error) {
      launchSnackbar(`Error getting articles : ${error}`, 'error')
    }
  }

  const createArticle = async (article: Article) => {
    try {
      article.interaction_progress = Number(article.interaction_progress)
      const response = await fetchWrapper.post('/articles', article)
      return response.data
    } catch (error) {
      launchSnackbar(`Error creating article : ${error}`, 'error')
    }
  }

  const updateArticle = async (id: string, article: Article) => {
    try {
      article.interaction_progress = Number(article.interaction_progress)
      const response = await fetchWrapper.put('/thought_outputs/' + id, article)
      return response
    } catch (error) {
      launchSnackbar(`Error updating article : ${error}`, 'error')
    }
  }

  return { newArticle, getArticle, createArticle, updateArticle, getArticles }
}
