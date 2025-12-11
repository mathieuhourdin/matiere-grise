<template>
  <ModalSheet :open="isOpen" @close="handleClose">
    <div class="md:p-6 max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Laissez une trace
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Ajoutez du texte ou enregistrez un message vocal
        </p>
      </div>

      <!-- Text Input Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Texte
        </label>
        <textarea
          v-model="textContent"
          placeholder="Écrivez votre message ici..."
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none"
          rows="4"
        ></textarea>
      </div>

      <!-- Audio Recording Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Enregistrement vocal
        </label>
        
        <!-- Recording Controls -->
        <div class="flex flex-col items-center space-y-4">
          <button
            @click="toggleRecording"
            :disabled="!canRecord || isSubmitting"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg',
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
              (!canRecord || isSubmitting) && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <span class="text-xl">{{ isRecording ? '⏹️' : '🎤' }}</span>
            <span>{{ isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement' }}</span>
          </button>

          <!-- Recording Status -->
          <div v-if="isRecording" class="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">Enregistrement en cours...</span>
          </div>

          <!-- Recording Time -->
          <div v-if="isRecording" class="text-lg font-mono text-gray-700 dark:text-gray-300">
            {{ formatTime(recordingTime) }}
          </div>

          <!-- Audio Preview -->
          <div v-if="audioUrl && !isRecording" class="w-full">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aperçu de l'enregistrement:
              </h4>
              <audio controls class="w-full" :src="audioUrl"></audio>
              <button
                @click="clearRecording"
                class="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Supprimer l'enregistrement
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          class="flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
        >
          Annuler
        </button>
        <button
          @click="submitResource"
          :disabled="isSubmitting || (!textContent.trim() && !hasAudio)"
          :class="[
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg',
            (isSubmitting || (!textContent.trim() && !hasAudio))
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
            <span>Créer la ressource</span>
          </span>
        </button>
      </div>

      <!-- Status Message -->
      <div v-if="statusMessage" class="mt-4 p-3 rounded-lg" :class="statusMessageClass">
        {{ statusMessage }}
      </div>
    </div>
  </ModalSheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWrapper } from '@/helpers/fetch-wrapper'
import { useResource } from '@/composables/useResource'
import { useUser } from '@/composables/useUser'
import { useSnackbar } from '@/composables/useSnackbar'
import ModalSheet from '@/components/Ui/ModalSheet.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', resourceId: string): void
}>()

const router = useRouter()
const { createTrace } = useResource()
const { user } = useUser()
const { launchSnackbar } = useSnackbar()

const isOpen = ref(false)
const textContent = ref('')
const isRecording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const audioUrl = ref<string>('')
const recordingTime = ref(0)
const recordingInterval = ref<number | null>(null)
const isSubmitting = ref(false)
const statusMessage = ref('')
const canRecord = ref(false)

const hasAudio = computed(() => audioChunks.value.length > 0 || audioUrl.value !== '')

const statusMessageClass = computed(() => {
  if (statusMessage.value.includes('succès') || statusMessage.value.includes('créé')) {
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
  } else if (statusMessage.value.includes('Erreur') || statusMessage.value.includes('erreur')) {
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
  }
  return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
})

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
  if (newValue) {
    // Reset form when opening
    textContent.value = ''
    clearRecording()
    statusMessage.value = ''
  }
})

onMounted(() => {
  // Initialize media devices
  if (navigator?.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        canRecord.value = true
        mediaRecorder.value = new MediaRecorder(stream)
        
        mediaRecorder.value.ondataavailable = (e: BlobEvent) => {
          audioChunks.value.push(e.data)
        }
        
        mediaRecorder.value.onstop = () => {
          const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
          audioUrl.value = URL.createObjectURL(blob)
          stopRecordingTimer()
        }
      })
      .catch(err => {
        console.error('Erreur d\'accès au microphone:', err)
        canRecord.value = false
        launchSnackbar('Impossible d\'accéder au microphone', 'error')
      })
  } else {
    canRecord.value = false
  }
})

const toggleRecording = () => {
  if (!mediaRecorder.value || !canRecord.value) return
  
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  if (!mediaRecorder.value) return
  
  isRecording.value = true
  audioChunks.value = []
  audioUrl.value = ''
  recordingTime.value = 0
  
  mediaRecorder.value.start()
  startRecordingTimer()
}

const stopRecording = () => {
  if (!mediaRecorder.value) return
  
  isRecording.value = false
  mediaRecorder.value.stop()
  stopRecordingTimer()
}

const startRecordingTimer = () => {
  recordingInterval.value = window.setInterval(() => {
    recordingTime.value++
  }, 1000)
}

const stopRecordingTimer = () => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
    recordingInterval.value = null
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const clearRecording = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  audioChunks.value = []
  audioUrl.value = ''
  recordingTime.value = 0
  if (isRecording.value) {
    stopRecording()
  }
}

const handleClose = () => {
  if (isRecording.value) {
    stopRecording()
  }
  clearRecording()
  emit('close')
}

const submitResource = async () => {
  if (!textContent.value.trim() && !hasAudio.value) {
    launchSnackbar('Veuillez ajouter du texte ou un enregistrement vocal', 'error')
    return
  }

  isSubmitting.value = true
  statusMessage.value = 'Création de la ressource...'

  try {
    // If there's audio, use the audio processing endpoint
    if (hasAudio.value) {
      await submitWithAudio()
    } else {
      // Otherwise, create a text-only resource
      await submitTextOnly()
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    statusMessage.value = `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    launchSnackbar('Erreur lors de la création de la ressource', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const submitWithAudio = async () => {
  const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
  
  const formData = new FormData()
  formData.append('file', blob, 'recording.webm')
  formData.append('message', textContent.value || '')
  formData.append('duration', recordingTime.value.toString())
  formData.append('timestamp', new Date().toISOString())

  const response = await fetchWrapper.post('/process_audio', formData, 'multipart/form-data')
  
  if (response.status === 200 && response.data?.created_interaction) {
    const resourceId = response.data?.created_interaction?.resource_id
    if (resourceId) {
      statusMessage.value = 'Ressource créée avec succès!'
      launchSnackbar('Ressource créée avec succès!', 'success')
      
      setTimeout(() => {
        handleClose()
        emit('created', resourceId)
        router.push(`/resources/${resourceId}`)
      }, 1500)
    } else {
      statusMessage.value = 'Ressource créée mais ID non trouvé'
    }
  } else {
    statusMessage.value = `Erreur: ${response.data?.message || 'Erreur inconnue'}`
  }
}

const submitTextOnly = async () => {
    const trace = { content: textContent.value };
  
  
 const createdTrace = await createTrace(trace)
  statusMessage.value = 'Trace créée avec succès!'
  launchSnackbar('Trace créée avec succès!', 'success')
  
  setTimeout(() => {
    handleClose()
    emit('created', createdTrace.id)
    router.push(`/resources/${createdTrace.id}`)
  }, 1500)
}
</script>

