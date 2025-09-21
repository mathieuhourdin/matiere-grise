<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Enregistrement Audio</h1>
    
    <!-- Recording Controls -->
    <div class="flex flex-col items-center space-y-4">
      <button 
        @click="toggleRecording"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-colors',
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        ]"
      >
        {{ isRecording ? '⏹️ Arrêter l\'enregistrement' : '🎤 Commencer l\'enregistrement' }}
      </button>
      
      <!-- Recording Status -->
      <div v-if="isRecording" class="flex items-center space-x-2 text-red-600">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-medium">Enregistrement en cours...</span>
      </div>
      
      <!-- Recording Time -->
      <div v-if="isRecording" class="text-lg font-mono">
        {{ formatTime(recordingTime) }}
      </div>
      
      <!-- Audio Preview -->
      <div v-if="audioUrl" class="w-full max-w-md">
        <h3 class="text-lg font-medium mb-2">Aperçu de l'enregistrement:</h3>
        <audio controls class="w-full" :src="audioUrl"></audio>
        
        <!-- Upload Section -->
        <div class="mt-4 space-y-3">
          <!-- Message Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message accompagnant l'audio:
            </label>
            <textarea
              v-model="messageText"
              placeholder="Ajoutez un message ou une description..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <!-- Upload Button -->
          <button 
            @click="uploadRecording"
            :disabled="isUploading"
            :class="[
              'w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2',
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            ]"
          >
            <span v-if="isUploading" class="animate-spin">⏳</span>
            <span v-else>💾</span>
            <span>{{ isUploading ? 'Envoi en cours...' : 'Envoyer l\'enregistrement' }}</span>
          </button>
          
          <!-- Upload Status -->
          <div v-if="uploadStatus" class="text-sm p-3 rounded-md" :class="uploadStatusClass">
            {{ uploadStatus }}
          </div>
        </div>
      </div>
      
      <!-- API Response Display -->
      <div v-if="apiResponse" class="w-full max-w-2xl mt-6">
        <h3 class="text-lg font-medium mb-3 text-gray-800">Réponse de l'API:</h3>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <!-- Response Status -->
          <div class="mb-3">
            <span class="font-medium text-gray-700">Statut:</span>
            <span :class="[
              'ml-2 px-2 py-1 rounded text-xs font-medium',
              apiResponse.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ apiResponse.status === 200 ? 'Succès' : 'Erreur' }}
            </span>
          </div>
          
          <!-- Response Data -->
          <div v-if="apiResponse.data" class="space-y-2">
            <div class="font-medium text-gray-700">Données reçues:</div>
            <pre class="bg-white border border-gray-200 rounded p-3 text-sm text-gray-800 overflow-x-auto">{{ JSON.stringify(apiResponse.data, null, 2) }}</pre>
          </div>
          
          <!-- Response Error -->
          <div v-if="apiResponse.status !== 200 && apiResponse.data" class="mt-3">
            <div class="font-medium text-red-700">Détails de l'erreur:</div>
            <div class="text-red-600 text-sm">{{ apiResponse.data }}</div>
          </div>
          
          <!-- Clear Response Button -->
          <button 
            @click="clearApiResponse"
            class="mt-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors"
          >
            Effacer la réponse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchWrapper } from '@/helpers/fetch-wrapper';

const router = useRouter();

const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const audioUrl = ref<string>('');
const recordingTime = ref(0);
const recordingInterval = ref<number | null>(null);
const messageText = ref('');
const isUploading = ref(false);
const uploadStatus = ref('');
const apiResponse = ref<any>(null);

// Computed property for upload status styling
const uploadStatusClass = computed(() => {
  if (uploadStatus.value.includes('succès')) {
    return 'bg-green-100 text-green-800 border border-green-200';
  } else if (uploadStatus.value.includes('Erreur')) {
    return 'bg-red-100 text-red-800 border border-red-200';
  }
  return 'bg-blue-100 text-blue-800 border border-blue-200';
});

// Only run on client-side where navigator is available
onMounted(() => {
  if (navigator?.mediaDevices) {
    // Initialize media devices
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      mediaRecorder.value = new MediaRecorder(stream);
      
      mediaRecorder.value.ondataavailable = (e: BlobEvent) => {
        audioChunks.value.push(e.data);
      };
      
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
        audioUrl.value = URL.createObjectURL(blob);
        stopRecordingTimer();
      };
    }).catch(err => {
      console.error('Erreur d\'accès au microphone:', err);
    });
  }
});

const toggleRecording = () => {
  if (!mediaRecorder.value) return;
  
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = () => {
  if (!mediaRecorder.value) return;
  
  isRecording.value = true;
  audioChunks.value = [];
  audioUrl.value = '';
  recordingTime.value = 0;
  
  mediaRecorder.value.start();
  startRecordingTimer();
};

const stopRecording = () => {
  if (!mediaRecorder.value) return;
  
  isRecording.value = false;
  mediaRecorder.value.stop();
  stopRecordingTimer();
};

const startRecordingTimer = () => {
  recordingInterval.value = window.setInterval(() => {
    recordingTime.value++;
  }, 1000);
};

const stopRecordingTimer = () => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value);
    recordingInterval.value = null;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const uploadRecording = async () => {
  if (audioChunks.value.length === 0) return;
  
  isUploading.value = true;
  uploadStatus.value = 'Préparation de l\'envoi...';
  
  try {
    const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
    await uploadAudio(blob);
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    uploadStatus.value = 'Erreur lors de l\'envoi';
  } finally {
    isUploading.value = false;
  }
};

async function uploadAudio(blob: Blob) {
  try {
    uploadStatus.value = 'Envoi en cours...';
    
    const formData = new FormData();
    formData.append("file", blob, "note.webm");
    formData.append("message", messageText.value);
    formData.append("duration", recordingTime.value.toString());
    formData.append("timestamp", new Date().toISOString());

    // Use the existing fetch wrapper instead of the Nuxt API utility
    const response = await fetchWrapper.post("/process_audio", formData, "multipart/form-data");
    
    // Store the API response for display
    apiResponse.value = response;
    
    if (response.status === 200 && response.data?.created_interaction) {
      uploadStatus.value = `Enregistrement envoyé avec succès! ID: ${response.data?.id || 'N/A'}`;
      
      // Check if we have a resource ID to redirect to
      const resourceId = response.data?.created_interaction?.resource_id;
      if (resourceId) {
        uploadStatus.value = `Enregistrement envoyé avec succès! Redirection vers la ressource...`;
        
        // Clear the recording after successful upload
        setTimeout(() => {
          audioChunks.value = [];
          audioUrl.value = '';
          messageText.value = '';
          uploadStatus.value = '';
          
          // Redirect to the created resource page using Vue Router
          router.push(`/resources/${resourceId}`);
        }, 2000);
      } else {
        // Fallback if no resource ID
        uploadStatus.value = `Enregistrement envoyé avec succès! ID: ${response.data?.id || 'N/A'}`;
        
        // Clear the recording after successful upload
        setTimeout(() => {
          audioChunks.value = [];
          audioUrl.value = '';
          messageText.value = '';
          uploadStatus.value = '';
        }, 3000);
      }
    } else if (response.status === 200 && !response.data?.created_interaction) {
      uploadStatus.value = ` Audio non reconnu par l'API: ${response.data.transcription} - ${response.data?.message || 'Erreur inconnue'}`;
    } else {
      uploadStatus.value = `Erreur lors de l'upload: ${response.status} - ${response.data?.message || 'Erreur inconnue'}`;
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    uploadStatus.value = `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    
    // Store error response for display
    apiResponse.value = {
      status: 500,
      data: error instanceof Error ? error.message : 'Erreur inconnue'
    };
    
    throw error;
  }
}

const clearApiResponse = () => {
  apiResponse.value = null;
};
</script>