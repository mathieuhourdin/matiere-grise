<template>
  <div class="p-2 border border-slate-400 dark:border-gray-600 h-fit shadow rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <div class="flex">
      <div class="m-2">Connectez-vous</div>
      <slot />
    </div>
    <TextInput class="m-2" label="Username" v-model="username" autocomplete="username" />
    <TextInput class="m-2" type="password" label="Password" v-model="password" autocomplete="current-password" />
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
