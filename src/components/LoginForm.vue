<template>
  <div class="md:w-1/3 border shadow rounded">
    <div class="flex">
      <div class="m-2">Connectez-vous</div>
      <slot />
    </div>
    <TextInput label="Username" v-model="username" />
    <TextInput type="password" label="Password" v-model="password" />
    <div class="flex">
      <ActionButton class="ml-auto m-2" text="Valider" type="valid" @click="submit" />
      <ActionButton class="m-2" text="Annuler" type="abort" @click="submit" />
    </div>
  </div>
</template>

<script setup>
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { fetchWrapper } from '@/helpers'
import { ref } from 'vue'
import router from '@/router'
import { useUser } from '@/composables/useUser.ts'

const { authUser } = useUser()
const username = ref('')
const password = ref('')

const submit = async () => {
  console.log('Submit')
  console.log(username.value)
  await authUser({ username: username.value, password: password.value })
}
</script>
