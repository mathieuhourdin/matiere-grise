<template>
  <div>
    <div>Nouvelle interaction, avec la ressource : {{ resource.title }}</div>
    <TextInput
      label="Avancement de l'ouvrage"
      v-model="interaction.interaction_progress"
      type="number"
    />
    <TextInput label="Date de lecture" v-model="interaction.interaction_date" type="date" />
    <TextAreaInput
      label="Pourquoi s'y être interessé ?"
      v-model="interaction.interaction_comment"
    />
    <div class="flex flex-row-reverse">
      <ActionButton @click="validate" class="m-4" text="Valider" type="valid" />
      <ActionButton @click="emitClose" class="m-4" text="Annuler" type="abort" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref } from 'vue'
import { useInteractions } from '@/composables/useInteraction'
import { useUser } from '@/composables/useUser'
import { type Resource } from '@/types/models'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  resource: Resource
}>()

const { newInteraction, createInteractionForResource } = useInteractions()
const { user } = useUser()

const interaction = ref(newInteraction())

const validate = () => {
  interaction.value.resource_id = props.resource.id
  interaction.value.interaction_type = 'inpt'
  interaction.value.interaction_user_id = user.value.id
  createInteractionForResource(props.resource.id, interaction.value)
  emit('refresh')
  emitClose()
}

const emitClose = () => emit('close')
</script>
