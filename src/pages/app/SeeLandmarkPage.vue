<template>
  <div class="p-4 md:px-8">
    <div v-if="loading" class="text-center text-2xl pt-10">Loading...</div>
    <div v-else-if="landmark">
      <div class="mb-6">
        <router-link
          to="/app/llm-calls"
          class="text-sm underline text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ← Back
        </router-link>
      </div>

      <h1 class="text-3xl font-bold mb-6">Landmark Details</h1>

      <!-- Base Info -->
      <div class="mb-6">
        <div class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4">
          <div v-if="landmark.title" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Title</div>
            <div class="text-2xl font-bold">{{ landmark.title }}</div>
          </div>
          <div v-if="landmark.subtitle" class="mb-4">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subtitle</div>
            <div class="text-lg">{{ landmark.subtitle }}</div>
          </div>
          <div v-if="landmark.content">
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Content</div>
            <div class="whitespace-pre-wrap text-sm">{{ landmark.content }}</div>
          </div>
        </div>
      </div>

      <!-- Parent Landmarks -->
      <div class="mb-6" v-if="landmark.parent_landmarks && landmark.parent_landmarks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Parent Landmarks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="parent in landmark.parent_landmarks"
            :key="parent.id"
            :to="`/app/landmarks/${parent.id}`"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Parent</div>
            <div class="text-base font-medium">{{ parent.title || 'Untitled' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">ID: {{ parent.id }}</div>
          </router-link>
        </div>
      </div>

      <!-- Related Elements -->
      <div class="mb-6" v-if="landmark.related_elements && landmark.related_elements.length > 0">
        <h2 class="text-xl font-semibold mb-4">Related Elements</h2>
        <div class="space-y-4">
          <div
            v-for="element in landmark.related_elements"
            :key="element.id"
            class="border border-slate-300 dark:border-zinc-700 rounded-lg p-4"
          >
            <div class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">ID</div>
              <div class="text-sm text-gray-500 dark:text-gray-500">{{ element.id }}</div>
            </div>
            <div v-if="element.title" class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</div>
              <div class="text-lg font-medium">{{ element.title }}</div>
            </div>
            <div v-if="element.subtitle" class="mb-2">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Subtitle</div>
              <div class="text-base">{{ element.subtitle }}</div>
            </div>
            <div v-if="element.content">
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Content</div>
              <div class="whitespace-pre-wrap text-sm">{{ element.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-2xl pt-10 text-red-600">Landmark not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLandmark, type LandmarkDetail } from '@/composables/useLandmark.ts'

const { getLandmark } = useLandmark()

const props = defineProps<{
  id: string
}>()

const landmark = ref<LandmarkDetail | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    landmark.value = await getLandmark(props.id)
  } catch (error) {
    console.error('Error loading landmark:', error)
  } finally {
    loading.value = false
  }
})
</script>
