<template>
  <div>
    <div>Nouvelle interaction, avec la ressource : {{ resource.title }}</div>
    <div class="flex flex-wrap">
      <TextInput
        label="Avancement de l'ouvrage"
        class="my-auto"
        v-model="interaction.interaction_progress"
        type="number"
      />
      <SelectInput
        label="Type d'interaction"
        class="m-4 w-full md:w-5/12 md:ml-auto"
        :choices="interactionTypeOptions"
        v-model="interaction.interaction_type"
      />
    </div>
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
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref, onMounted } from 'vue'
import { useInteractions } from '@/composables/useInteraction'
import { useUser } from '@/composables/useUser'
import { type Resource } from '@/types/models'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  resource: Resource
}>()

const interactionTypeOptions = ref([
  { text: 'Lecture / Visionage', value: 'inpt' },
  { text: 'Envie', value: 'wish' }
])

const { newInteraction, createInteractionForResource } = useInteractions()
const { user } = useUser()

const interaction = ref(newInteraction())

onMounted(() => {
  if (!interaction.value.interaction_type) interaction.value.interaction_type = 'inpt'
})

const validate = () => {
  interaction.value.resource_id = props.resource.id
  interaction.value.interaction_user_id = user.value.id
  createInteractionForResource(props.resource.id, interaction.value)
  emit('refresh')
  emitClose()
}

const emitClose = () => emit('close')
</script>
