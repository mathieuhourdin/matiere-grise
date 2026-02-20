<template>
  <div class="min-h-screen text-slate-100 p-4 md:p-10 md:w-10/12 mx-auto">
    <div class="max-w-3xl">
      <h1 class="text-2xl font-bold mb-3">Ta biographie</h1>
      <p class="text-sm text-slate-400 mb-6">
        Écris une courte biographie pour présenter ton parcours et tes centres d'intérêt.
        </p>
        <p class="text-sm text-slate-400 mb-6">
        Tu peux raconter des éléments de ta vie perso ou pro, plus tu donnes d'éléments ici plus il sera facile de reconnaître des éléments dans tes carnets.
      </p>

      <div v-if="!user" class="text-sm text-slate-400">Chargement...</div>

      <div v-else class="space-y-5">
        <TextAreaInput
          v-model="biography"
          label="Biographie"
          placeholder="Parle de ton parcours, ton style de travail et ce qui t'anime."
          class="h-72"
        />

        <div class="flex justify-end">
          <ActionButton type="valid" :disabled="saving" @click="saveAndFinish">
            {{ saving ? 'Enregistrement...' : 'Terminer' }}
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import { type User } from '@/types/models'

const router = useRouter()
const { user, loadUser, updateUser } = useUser()
const { launchSnackbar } = useSnackbar()

const biography = ref('')
const saving = ref(false)

onMounted(async () => {
  if (!user.value) await loadUser()
  biography.value = (user.value as any)?.biography ?? ''
})

const saveAndFinish = async () => {
  if (saving.value) return
  if (!user.value?.id) {
    launchSnackbar('Utilisateur non trouvé', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      ...user.value,
      biography: biography.value
    } as User
    await updateUser(user.value.id, payload)
    await loadUser()
    router.push('/me/home')
  } catch (error) {
    console.error('Error updating biography:', error)
    launchSnackbar("Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}
</script>

