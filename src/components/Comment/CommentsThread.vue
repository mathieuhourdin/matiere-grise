<template>
  <div>
    <CommentCard
      v-for="comment in filteredComments"
      :key="comment.id"
      class="w-full"
      v-model="comment.content"
      :editing="comment.editing"
      @validate="comment.editing = false"
      :author="comment.author"
      :created-at="comment.created_at"
    />
    <CommentCard
      class="w-full"
      v-model="newCommentContent"
      :editing="true"
      @validate="validateNewComment"
      :author="user"
      :created-at="null"
    />
  </div>
</template>

<script setup lang="ts">
import CommentCard from '@/components/Comment/CommentCard.vue'
import { useComments } from '@/composables/useComments'
import { useUser } from '@/composables/useUser'
import { ref, onMounted, computed } from 'vue'
import { type Comment } from '@/types/models'
const props = defineProps<{
  resourceId: string
}>()

const { user } = useUser()

const comments = ref<Comment[]>([])
const { createComment, getCommentsForThoughtOutput } = useComments()
const loadComments = async () => {
  console.log('Comment thread')
  console.log('Props id : ', props.resourceId)
  comments.value = await getCommentsForThoughtOutput(props.resourceId)
}

const filteredComments = computed(() => {
  return comments.value
    .filter((comment) => !comment.start_index)
    .sort((a, b) => a.created_at - b.created_at)
})

const newCommentContent = ref<string>('')
const validateNewComment = async () => {
  await createComment(props.resourceId, null, newCommentContent.value, false)
  newCommentContent.value = ''
  await loadComments()
}

onMounted(async () => await loadComments())
</script>
