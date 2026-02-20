<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <h1 class="text-2xl font-bold mb-4">Mon profil</h1>
    
    <div v-if="!user" class="text-center p-8">
      <p>Chargement...</p>
    </div>
    
    <div v-else class="max-w-2xl">
      <!-- Profile Picture Preview -->
      <div class="mb-6 text-center">
        <img
          v-if="editableUser.profile_picture_url"
          :src="editableUser.profile_picture_url"
          alt="Profile picture"
          class="mx-auto w-32 h-32 rounded-full object-cover border-2 border-gray-400 dark:border-gray-600"
        />
        <div
          v-else
          class="mx-auto w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
        >
          <span class="text-gray-500 dark:text-gray-400 text-4xl">👤</span>
        </div>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          class="col-span-2"
          label="Photo de profil (URL)"
          v-model="editableUser.profile_picture_url"
          placeholder="https://example.com/image.jpg"
        />
        
        <TextInput
          label="Prénom"
          v-model="editableUser.first_name"
          placeholder="Votre prénom"
        />
        
        <TextInput
          label="Nom"
          v-model="editableUser.last_name"
          placeholder="Votre nom"
        />
        
        <TextInput
          label="Pseudo"
          v-model="editableUser.pseudonym"
          placeholder="Votre pseudo"
        />
        
        <div class="col-span-2">
          <CheckboxInput
            v-model="editableUser.pseudonymized"
            label="Ne montrer que votre pseudo"
          />
        </div>
        
        <TextInput
          label="Email"
          v-model="editableUser.email"
          type="email"
          placeholder="votre@email.com"
          autocomplete="email"
        />
        
        <TextInput
          label="Handle"
          v-model="editableUser.handle"
          placeholder="@votre_handle"
        />
        
        <div class="col-span-2">
          <TextAreaInput
            v-model="editableUser.biography"
            label="Biographie"
            placeholder="Parlez-nous de vous..."
            class="h-80"
          />
        </div>

        <div class="col-span-2">
          <TextAreaInput
            v-model="editableUser.high_level_projects_definition"
            label="High level projects definition"
            placeholder="Décrivez vos projets et objectifs globaux..."
            class="h-48"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-row-reverse gap-4">
        <ActionButton @click="saveChanges" type="valid">
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </ActionButton>
        <ActionButton @click="resetForm" type="abort">
          Annuler
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import { type User } from '@/types/models'
import TextInput from '@/components/Ui/TextInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import CheckboxInput from '@/components/Ui/CheckboxInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'

const { user, updateUser, loadUser } = useUser()
const { launchSnackbar } = useSnackbar()

const editableUser = ref<User & { biography?: string; high_level_projects_definition?: string }>({
  email: '',
  first_name: '',
  last_name: '',
  handle: '',
  pseudonym: '',
  pseudonymized: false,
  profile_picture_url: '',
  biography: '',
  high_level_projects_definition: ''
})

const originalUser = ref<User & { biography?: string; high_level_projects_definition?: string } | null>(null)
const saving = ref(false)

onMounted(async () => {
  if (!user.value) {
    await loadUser()
  }
  if (user.value) {
    initializeForm()
  }
})

watch(() => user.value, () => {
  if (user.value) {
    initializeForm()
  }
}, { deep: true })

function initializeForm() {
  if (user.value) {
    editableUser.value = {
      ...user.value,
      biography: (user.value as any).biography || '',
      high_level_projects_definition: (user.value as any).high_level_projects_definition || ''
    }
    originalUser.value = {
      ...user.value,
      biography: (user.value as any).biography || '',
      high_level_projects_definition: (user.value as any).high_level_projects_definition || ''
    }
  }
}

function resetForm() {
  if (originalUser.value) {
    editableUser.value = { ...originalUser.value }
  }
}

async function saveChanges() {
  if (saving.value) return // Prevent double submission
  
  if (!user.value?.id) {
    launchSnackbar('Utilisateur non trouvé', 'error')
    return
  }

  saving.value = true
  try {
    // Ensure handle starts with @
    if (editableUser.value.handle && !editableUser.value.handle.startsWith('@')) {
      editableUser.value.handle = '@' + editableUser.value.handle
    }

    const updatedUser = await updateUser(user.value.id, editableUser.value as User)
    originalUser.value = { ...editableUser.value }
    // Reload user data to sync with server
    await loadUser()
    launchSnackbar('Profil mis à jour avec succès', 'success')
  } catch (error) {
    console.error('Error updating user:', error)
    launchSnackbar('Erreur lors de la mise à jour du profil', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Hide scrollbars while maintaining scroll functionality */
.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar,
.overflow-auto::-webkit-scrollbar,
.overflow-scroll::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto,
.overflow-y-auto,
.overflow-auto,
.overflow-scroll {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
