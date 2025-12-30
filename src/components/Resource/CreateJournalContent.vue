<template>
  <div class="md:p-6 mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Créer un nouveau journal
      </h2>
    </div>

    <!-- Title Input -->
    <div class="mb-4">
      <TextInput
        v-model="title"
        label="Titre"
        placeholder="Entrez le titre du journal..."
        class="w-full"
      />
    </div>

    <!-- Subtitle Input -->
    <div class="mb-4">
      <TextInput
        v-model="subtitle"
        label="Sous-titre"
        placeholder="Entrez le sous-titre du journal..."
        class="w-full"
      />
    </div>

    <!-- Content Input Section -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Contenu
      </label>
      <textarea
        v-model="content"
        placeholder="Écrivez le contenu de votre journal ici..."
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-elevated text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none"
        rows="10"
        @keydown.enter.stop
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        v-if="showCancel"
        @click="handleCancel"
        :disabled="isSubmitting"
        class="flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-elevated hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
      >
        Annuler
      </button>
      <button
        @click="submitJournal"
        :disabled="isSubmitting || !title.trim()"
        :class="[
          'flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg',
          (isSubmitting || !title.trim())
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
        ]"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center space-x-2">
          <span class="animate-spin">⏳</span>
          <span>Création en cours...</span>
        </span>
        <span v-else class="flex items-center justify-center space-x-2">
          <span>✨</span>
          <span>Créer le journal</span>
        </span>
      </button>
    </div>

    <!-- Status Message -->
    <div v-if="statusMessage" class="mt-4 p-3 rounded-lg" :class="statusMessageClass">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useResource } from '@/composables/useResource'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'
import { useSnackbar } from '@/composables/useSnackbar'
import TextInput from '@/components/Ui/TextInput.vue'
import type { Resource } from '@/types/models'

const props = defineProps<{
  showCancel?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', resourceId: string): void
}>()

const router = useRouter()
const { createResource } = useResource()
const { createInteractionForResource } = useInteraction()
const { user } = useUser()
const { launchSnackbar } = useSnackbar()

const title = ref('')
const subtitle = ref('')
const content = ref('')
const isSubmitting = ref(false)
const statusMessage = ref('')

const statusMessageClass = computed(() => {
  if (statusMessage.value.includes('succès') || statusMessage.value.includes('créé')) {
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
  } else if (statusMessage.value.includes('Erreur') || statusMessage.value.includes('erreur')) {
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
  }
  return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
})

const resetForm = () => {
  title.value = ''
  subtitle.value = ''
  content.value = ''
  statusMessage.value = ''
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

const submitJournal = async () => {
  if (!title.value.trim()) {
    launchSnackbar('Veuillez entrer un titre', 'error')
    return
  }

  isSubmitting.value = true
  statusMessage.value = 'Création du journal...'

  try {
    // Create the resource
    const resource: Resource = {
      title: title.value.trim(),
      subtitle: subtitle.value.trim(),
      content: content.value.trim(),
      external_content_url: '',
      comment: '',
      image_url: '',
      maturing_state: 'drft',
      publishing_state: '',
      resource_type: 'jrnl',
      is_local_draft: false
    }

    const createdResource = await createResource(resource)

    // Create an interaction for the resource
    const interactionPayload = {
      interaction_user_id: user.value?.id,
      resource_id: createdResource.id,
      interaction_progress: 0,
      interaction_date: new Date(),
      interaction_comment: '',
      interaction_is_public: false
    }

    await createInteractionForResource(createdResource.id, interactionPayload)

    statusMessage.value = 'Journal créé avec succès!'
    launchSnackbar('Journal créé avec succès!', 'success')

    setTimeout(() => {
      resetForm()
      emit('created', createdResource.id)
      router.push(`/app/resources/${createdResource.id}`)
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    statusMessage.value = `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    launchSnackbar('Erreur lors de la création du journal', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

