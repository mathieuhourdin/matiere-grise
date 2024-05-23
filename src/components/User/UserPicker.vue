<template>
  <SelectInput
    label="Utilisateur"
    class=""
    :choices="usersChoices"
    :model-value="modelValue"
    @update:modelValue="(event) => emitChange(event)"
  />
</template>
<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import { type User, type Interaction } from '@/types/models'

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  modelValue?: User
}>()

const { getUsers, getUserById } = useUser()

const users = ref<User[]>([])

const formatUserForSelect = (toFormatUser: User) => {
  if (!toFormatUser) return
  return { text: toFormatUser.display_name, value: toFormatUser.id }
}

const usersChoices = computed(() => {
  if (!users.value) return
  return users.value.map((user) => formatUserForSelect(user))
})

const emitChange = (event: any) => {
  emit('update:modelValue', event)
}

onMounted(async () => {
  users.value = await getUsers()
})
</script>
