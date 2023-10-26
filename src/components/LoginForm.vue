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

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { useRoute } from 'vue-router'
const route = useRoute()

const { authUser } = useUser()
const username = ref('')
const password = ref('')

const submit = async () => {
  console.log('Submit')
  console.log(username.value)
  await authUser({ username: username.value, password: password.value }, route.query.redirectPath)
}
</script>
