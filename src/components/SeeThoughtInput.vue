<template>
  <div>
    <ResourceComponent :id="thoughtInput.resource_id" />
    <hr class="border-top border-zinc-400 my-4" />
    <div class="text-xs italic">Raison de la lecture</div>
    <TextInterface
      :full-text="thoughtInput.interaction_comment"
      :editable="isThoughtInputAuthor"
    />
  </div>
</template>

<script setup lang="ts">
import TextInterface from '@/components/TextInterface.vue'
import ResourceComponent from '@/components/ResourceComponent.vue'
import { useUser } from '@/composables/useUser'
import { type ApiInteraction, type User } from '@/types/models'
import { ref, computed, onMounted } from 'vue'

const { getUserById, user } = useUser()

const props = defineProps<{
  thoughtInput: ApiInteraction
}>()

const inputUser = ref<User | null>(null)

const isThoughtInputAuthor = computed(() => {
  return user.value ? props.thoughtInput.interaction_user_id === user.value.id : false
})

onMounted(async () => {
  if (props.thoughtInput.interaction_user_id)
    inputUser.value = await getUserById(props.thoughtInput.interaction_user_id)
})
</script>
