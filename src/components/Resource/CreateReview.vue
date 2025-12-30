<template>
  <div>
    <div>Demander une Review pour l'article :</div>
    <div>{{ resource.title }}</div>
    <UserPicker v-model="reviewUser" />
    <TextAreaInput class="mt-4" label="Message pour la review" v-model="interactionComment" />
      <div class="flex flex-row-reverse mt-4">
        <ActionButton type="valid" @click="createReview">Ajouter</ActionButton>
        <ActionButton type="abort" @click="emit('close')" class="mr-1">Annuler</ActionButton>
      </div>
  </div>
</template>

<script setup lang="ts">
import UserPicker from '@/components/User/UserPicker.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useInteraction } from '@/composables/useInteraction'
import { ref } from 'vue'

const emit = defineEmits(["close", "refresh"])

const props = defineProps<{
  resource: Resource
}>()

const { newInteraction, createInteractionForResource } = useInteraction()

const createReview = async () => {
  const review = newInteraction();
  review.interaction_user_id = reviewUser.value
  review.resource_id = props.resource.id
  review.interaction_type = "rvew"
  review.interaction_comment = interactionComment.value
  const response = await createInteractionForResource(props.resource.id, review)
  emit("refresh")
  emit("close")
}

const interactionComment = ref<string>('')
const reviewUser = ref<User|null>(null)

</script>
