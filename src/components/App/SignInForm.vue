<template>
  <div class="md:w-2/5 h-fit border shadow rounded p-4">
    <div class="m-2">Inscription</div>
    <TextInput class="mt-2" label="Email*" v-model="newUser.email" autocomplete="email" />
    <TextInput class="mt-2" label="Prénom" v-model="newUser.first_name" autocomplete="given-name" />
    <TextInput class="mt-2" label="Nom" v-model="newUser.last_name" autocomplete="family-name" />
    <TextInput class="mt-2" label="Photo de profil" v-model="newUser.profile_picture_url" autocomplete="url" />
    <img
      v-if="newUser.profile_picture_url != ''"
      class="rounded mt-2 mx-auto"
      :src="newUser.profile_picture_url"
    />
    <TextInput class="mt-2" label="Pseudo" v-model="newUser.pseudonym" />
    <CheckboxInput
      class="mt-2"
      v-model="newUser.pseudonymized"
      label="Ne montrer que votre pseudo"
    />
    <TextInput class="mt-2" label="handle* (@comme_sur_insta)" v-model="newUser.handle" />
    <TextInput class="mt-2" label="Password*" v-model="newUser.password" type="password" />
    <div class="mt-2 flex">
      <ActionButton class="ml-auto m-2" type="valid" @click="submit">Valider</ActionButton>
      <ActionButton class="m-2" type="abort" @click="submit">Annuler</ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import CheckboxInput from '@/components/Ui/CheckboxInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref, watch } from 'vue'
import { useUser } from '@/composables/useUser'

const { createNewUser } = useUser()

const newUser = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  profile_picture_url: '',
  handle: '@',
  password: '',
  pseudonym: '',
  pseudonymized: false
})

watch(
  () => [newUser.value.first_name, newUser.value.last_name],
  ([firstName, lastName]) => {
    if (firstName || lastName) {
      const firstPart = firstName ? firstName.toLowerCase().replace(/\s+/g, '_') : ''
      const lastPart = lastName ? lastName.toLowerCase().replace(/\s+/g, '_') : ''
      if (firstPart && lastPart) {
        newUser.value.handle = '@' + firstPart + '_' + lastPart
      } else if (firstPart) {
        newUser.value.handle = '@' + firstPart
      } else if (lastPart) {
        newUser.value.handle = '@' + lastPart
      } else {
        newUser.value.handle = '@'
      }
    } else {
      newUser.value.handle = '@'
    }
  },
  { immediate: true }
)

const submit = async () => {
  await createNewUser(newUser.value)
}
</script>
