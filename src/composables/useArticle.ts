import { ref } from 'vue'
import { fetchWrapper } from '@/helpers'
import { type Resource } from '@/types/models'
import { useSnackbar } from '@/composables/useSnackbar'
const { launchSnackbar } = useSnackbar()

export function useArticle() {
  const newArticle = () => {
    return ref<Resource>({
      title: '',
      subtitle: '',
      content: '',
      comment: '',
      maturing_state: '',
      publishing_state: 'drft',
      external_content_url: '',
      image_url: '',
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

  //TODO replace by create resource
  const createArticle = async (article: Resource) => {
    try {
      const response = await fetchWrapper.post('/articles', article)
      return response.data
    } catch (error) {
      launchSnackbar(`Error creating article : ${error}`, 'error')
    }
  }

  //TODO replace by update resource
  const updateArticle = async (id: string, article: Resource) => {
    try {
      const response = await fetchWrapper.put('/thought_outputs/' + id, article)
      return response
    } catch (error) {
      launchSnackbar(`Error updating article : ${error}`, 'error')
    }
  }

  return { newArticle, getArticle, createArticle, updateArticle, getArticles }
}
