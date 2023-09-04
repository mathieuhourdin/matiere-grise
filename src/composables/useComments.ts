import { type User, useUser } from '@/composables/useUser'

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

const createComment = (startIndex: number) => {
    const { user } = useUser();
    const newComment = {
        id: Math.floor(Math.random() * 2000),
        created_at: Date.now(),
        content: "",
        start_index: startIndex,
        end_index: startIndex,
        author: user,
        editing: true,
    }
    return newComment;
};

export function useComments() {
    return { createComment };
}
