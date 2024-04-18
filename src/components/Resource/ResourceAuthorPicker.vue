<template>
  <div class="grid grid-cols-3 gap-4">
    <UserPicker :model-value="userValue" @update:modelValue="(event) => chooseUser(event)" />
    <TextInput
      v-if="interaction"
      class="text-2xs"
      label="Date d'écriture"
      :model-value="
        interaction.interaction_date ? interaction.interaction_date.split('T')[0] : null
      "
      @update:modelValue="(event) => updateFields({ ...interaction, interaction_date: event })"
      type="date"
    />
    <NumberInput
      v-if="interaction"
      class=""
      label="Progression"
      :modelValue="interaction.interaction_progress"
      @update:modelValue="(event) => updateFields({ ...interaction, interaction_progress: event })"
    />
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import UserPicker from '@/components/User/UserPicker.vue'
import { type User, type Interaction } from '@/types/models'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'
const emit = defineEmits(['update'])
const props = defineProps<{
  interaction?: Interaction
  resourceId: string
}>()

const userValue = computed(() => props.interaction?.interaction_user_id)

const { createInteractionForResource, newInteraction, createInteraction, updateInteraction } =
  useInteraction()

const chooseUser = async (newUser) => {
  console.log(`newUser : ${JSON.stringify(newUser)}`)
  if (!props.interaction) {
    console.log('create interaction')
    const interactionPayload = newInteraction()
    interactionPayload.interaction_user_id = newUser
    interactionPayload.resource_id = props.resourceId
    await createInteractionForResource(props.resourceId, interactionPayload)
    emit('update')
  } else {
    const interactionPayload = { ...props.interaction }
    interactionPayload.interaction_user_id = newUser
    console.log('newUserid : ', newUser.id)
    console.log(`Interaction payload : ${JSON.stringify(interactionPayload)}`)
    await updateInteraction(props.interaction.id, interactionPayload)
    emit('update')
  }
}

const updateFields = async (newValue) => {
  await updateInteraction(props.interaction.id, newValue)
  emit('update')
}

</script>
