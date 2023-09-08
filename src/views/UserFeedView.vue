<template>
  <div>
    <div class="m-8">
    <UserInfos class="mx-auto border my-8" v-if="user" :user="user" />
    <div class="text-center m-4 italic text-sm">Derniers apports extérieurs</div>
    <ThoughtInputsList class="mx-auto" :thought-inputs="thoughtInputs" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import UserInfos from '@/components/UserInfos.vue'
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
