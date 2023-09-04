import { type User, useUser } from '@/composables/useUser'
import { fetchWrapper } from '@/helpers'

interface Comment {
  id?: string
  article_id: string
  created_at: Date
  content: string
  start_index: number
  end_index: number
  author: User
  editing: boolean
}

const createComment = async (articleId: string, startIndex: number) => {
  const { user } = useUser()
  const payload = {
    start_index: startIndex,
    end_index: startIndex
  }
  try {
    const response = await fetchWrapper.post('/articles/' + articleId + '/comments', payload)
    return response.data
  } catch (error) {
      console.log("error : ", error);
  }
}

const getCommentsForArticle = async (articleId: string) => {
    try {
        const response = await fetchWrapper.get('/articles/' + articleId + '/comments');
        return response.data;
    } catch (error) {
        console.log("error : ", error);
    }
}

const updateComment = async (comment: Comment) => {
    try {
        const response = await fetchWrapper.put('/comments/' + comment.id, comment);
        return response.data;
    } catch (error) {
        console.log("error : ", error)
    }
}

const batchUpdateComments = async (comments: [Comment]) => {
    console.log("comments : ", comments)
    comments.map((comment) => updateComment(comment));
}

export function useComments() {
  return { createComment, getCommentsForArticle, updateComment, batchUpdateComments }
}
