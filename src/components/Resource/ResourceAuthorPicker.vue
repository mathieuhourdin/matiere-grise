<template>
  <div>
    <div class="flex flex-wrap">
      <SelectInput
        label="Auteur"
        class="my-auto"
        :choices="usersChoices"
        :model-value="userValue"
        @update:modelValue="(event) => chooseUser(event)"
      />
      <TextInput
        v-if="interaction"
        class="my-auto"
        label="Date d'écriture"
        :model-value="interaction.interaction_date? interaction.interaction_date.split('T')[0] : null"
        @update:modelValue="(event) => updateFields({ ...interaction, interaction_date: event })"
        type="date"
      />
      <NumberInput
        v-if="interaction"
        class="my-auto"
        label="Progression"
        :modelValue="interaction.interaction_progress"
        @update:modelValue="
          (event) => updateFields({ ...interaction, interaction_progress: event })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import { type User, type Interaction } from '@/types/models'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'
const emit = defineEmits(['update'])
const props = defineProps<{
  interaction?: Interaction
  resourceId: string
}>()
const user = ref<User | null>(null)
const users = ref<User[]>([])

const formatUserForSelect = (toFormatUser: User) => {
  if (!toFormatUser) return
  return { text: `${toFormatUser.first_name} ${toFormatUser.last_name}`, value: toFormatUser.id }
}

const userValue = computed(() => user.value?.id)
const usersChoices = computed(() => {
  if (!users.value) return
  return users.value.map((user) => formatUserForSelect(user))
})
const { getUsers, getUserById } = useUser()

const loadUser = async (interaction) =>
  (user.value = await getUserById(interaction.interaction_user_id))

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

onMounted(async () => {
  users.value = await getUsers()
  await loadUser(props.interaction)
})

watch(toRefs(props).interaction, async (interaction) => await loadUser(interaction))
</script>
