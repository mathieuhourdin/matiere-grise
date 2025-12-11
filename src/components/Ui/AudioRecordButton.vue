<template>
  <div class="">
    <button
      @click="navigateToAudioRecording"
      class="w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group touch-manipulation"
      title="Enregistrer un nouvel audio"
    >
      <div class="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-200">
        🎤
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToAudioRecording = () => {
  //router.push('/create-resource/audio')
}
</script> 