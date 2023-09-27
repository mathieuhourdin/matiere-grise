import { useUser } from '@/composables/useUser'
import { type Comment } from '@/types/models'
import { fetchWrapper } from '@/helpers'

const createComment = async (articleId: string, startIndex: number): Promise<Comment> => {
  const { user } = useUser()
  const payload = {
    start_index: startIndex,
    end_index: startIndex
  }
  try {
    const response = await fetchWrapper.post('/thought_outputs/' + articleId + '/comments', payload)
    const comment = formatComment(response.data);
    if (user.value && comment.author_id == user.value.id) {
        comment.author = user.value;
    }
    return comment;
  } catch (error) {
      console.log("error : ", error);
      throw error;
  }
}

const formatComment = (apiComment: any): Comment => {
    apiComment.updated_at = new Date(apiComment.updated_at.split(".")[0])
    apiComment.created_at = new Date(apiComment.created_at.split(".")[0])
    return apiComment as Comment
}

const getCommentsForThoughtOutput = async (articleId: string, withUsers: boolean = true): Promise<Comment[]> => {
    const userParams = withUsers ? "?author=true" : "";
    try {
        const response = await fetchWrapper.get('/thought_outputs/' + articleId + '/comments' + userParams);
        return response.data.map((comment: any) => formatComment(comment))
    } catch (error) {
        console.log("error : ", error);
        throw error;
    }
}

const updateComment = async (comment: Comment) => {
    try {
        const response = await fetchWrapper.put('/comments/' + comment.id, comment);
        return formatComment(response.data);
    } catch (error) {
        console.log("error : ", error)
    }
}

const batchUpdateComments = async (comments: Comment[]) => {
    console.log("comments : ", comments)
    comments.map((comment) => updateComment(comment));
}

export function useComments() {
  return { createComment, getCommentsForThoughtOutput, updateComment, batchUpdateComments }
}
