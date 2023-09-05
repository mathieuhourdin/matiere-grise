<template>
  <div class="w-1/3 border shadow rounded">
    <div class="m-2">Inscription</div>
    <TextInput label="Email" v-model="newUser.email" />
    <TextInput label="Prénom" v-model="newUser.first_name" />
    <TextInput label="Nom" v-model="newUser.last_name" />
    <TextInput label="handle" v-model="newUser.handle" />
    <TextInput label="Password" v-model="newUser.password" />
    <div class="flex">
      <ActionButton class="ml-auto m-2" text="Valider" type="valid" @click="submit" />
      <ActionButton class="m-2" text="Annuler" type="abort" @click="submit" />
    </div>
  </div>
</template>

<script setup>
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref } from 'vue'
import { useUser } from '@/composables/useUser.ts'

const { createNewUser } = useUser()

const newUser = ref({
  username: '',
  first_name: '',
  last_name: '',
  handle: '',
  password: ''
})

const submit = async () => {
  await createNewUser(newUser.value)
}
</script>
