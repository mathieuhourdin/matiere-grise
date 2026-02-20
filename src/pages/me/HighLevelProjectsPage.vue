<template>
  <div class="min-h-screen text-slate-100 p-4 md:p-10 md:w-10/12 mx-auto">
    <div class="max-w-3xl">
      <h1 class="text-2xl font-bold mb-3">Tes projets à haut niveau</h1>
      <p class="text-sm text-slate-400 mb-6">
        Décris les grands projets sur lesquels tu veux avancer dans les prochains mois.<br />
        Ces projets seront utilisés pour segmenter ton activité dans l'application, ce sont les grandes dimensions de ta vie perso et pro.<br />
        Pour chacun, n'hésite pas à donner quelques informations sur le contexte : le nom des personnes impliquées, de choses que tu produis...<br />
        Cela permettra de mieux les identifier dans tes carnets.<br />
        Tu n'as pas de projets ? Ne t'inquiète pas, c'est complètement okey !<br />
        Tu pourras toujours les ajouter plus tard.
      </p>

      <div v-if="!user" class="text-sm text-slate-400">Chargement...</div>

      <div v-else class="space-y-5">
        <TextAreaInput
          v-model="projectDefinition"
          label="High level projects definition"
          placeholder="Ex: Construire un prototype, publier une série d'articles, structurer un projet pro..."
          class="h-72"
        />

        <div class="flex justify-end">
          <ActionButton type="valid" :disabled="saving" @click="saveAndContinue">
            {{ saving ? 'Enregistrement...' : 'Continuer' }}
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

const projectDefinition = ref('')
const saving = ref(false)

onMounted(async () => {
  if (!user.value) await loadUser()
  projectDefinition.value = (user.value as any)?.high_level_projects_definition ?? ''
})

const saveAndContinue = async () => {
  if (saving.value) return
  if (!user.value?.id) {
    launchSnackbar('Utilisateur non trouvé', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      ...user.value,
      high_level_projects_definition: projectDefinition.value
    } as User
    await updateUser(user.value.id, payload)
    await loadUser()
    router.push('/me/biography')
  } catch (error) {
    console.error('Error updating high level projects definition:', error)
    launchSnackbar("Erreur lors de l'enregistrement", 'error')
  } finally {
    saving.value = false
  }
}
</script>
