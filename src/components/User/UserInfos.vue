<template>
  <div class="text-center p-4 bg-slate-200">
    <div v-if="!editUser">
      <img :src="user.profile_picture_url" class="mx-auto m-4 w-1/6" />
      <div class="text-2xl bold">{{ user.first_name }} {{ user.last_name }}</div>
      <div>{{ user.handle }}</div>
      <div>{{ user.email }}</div>
      <div class="mt-4">{{ user.biography }}</div>
      <RoundLinkButton class="right-4 absolute" v-if="isUserEditable" @click="editUser = true"
        ><PencilSquareIcon class="m-1"
      /></RoundLinkButton>
    </div>
    <div v-else>
      <TextInput
        class="mx-auto w-2/3"
        v-model="editableUser.profile_picture_url"
        label="Photo de profil"
      />
      <div class="flex mx-auto">
        <TextInput class="ml-auto" v-model="editableUser.first_name" label="Prénom" />
        <TextInput class="mr-auto" v-model="editableUser.last_name" label="Nom" />
      </div>
      <div v-if="editableUser.is_platform_user" class="flex">
        <TextInput class="ml-auto" v-model="editableUser.handle" label="Handle" />
        <TextInput class="mr-auto" v-model="editableUser.email" label="Email" />
      </div>
      <div><TextAreaInput v-model="editableUser.biography" label="Bio" /></div>
      <div class="flex flex-row-reverse">
        <ActionButton @click="editUser = false" text="Valider" type="valid" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { type User } from '@/types/models'
import { useUser } from '@/composables/useUser'
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
const props = defineProps<{
  user: User
}>()

const { user: authUser, debouncedUpdateUser } = useUser()
const route = useRoute()

const isUserEditable = computed(() => {
  return !props.user.is_platform_user || props.user.id === authUser.value.id
})

const editUser = ref<boolean>(false)

const editableUser = ref<User | null>(null)

onMounted(() => {
  editableUser.value = props.user
  editUser.value = route.query.editingUser
})

watch(editableUser, (editableUser) => debouncedUpdateUser(editableUser.id, editableUser), {
  deep: true
})
</script>
