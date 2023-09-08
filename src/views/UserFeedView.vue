<template>
  <div>
    <div>{{user}}</div>
    <ThoughtInputsList :thought-inputs="thoughtInputs" />
  </div>
</template>
<script setup lang="ts">
  import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { ref, onMounted } from 'vue'
import { useUser } from '@/composables/useUser.ts'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'

const props = defineProps<{
  userId: string
}>()

const { getUserById } = useUser()

const user = ref(null)


const { getUserThoughtInputs } = useThoughtInputs()
const thoughtInputs = ref([])

onMounted(async () => {
  user.value = await getUserById(props.userId)
  thoughtInputs.value = await getUserThoughtInputs(props.userId)
})
</script>
