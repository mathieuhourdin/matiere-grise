<template>
  <section class="font-inter">
    <div v-if="!displayLandscapeAnalysis" class="text-sm text-slate-500 mt-3">
      Aucune analyse courante
    </div>
    <div v-else-if="isLoadingLandmarks" class="text-sm text-slate-500 mt-3">
      Chargement...
    </div>
    <div v-else-if="visibleLandmarks.length === 0" class="text-sm text-slate-500 mt-3">
      Aucun landmark
    </div>
    <div v-else class="mt-3">
      <ul class="list-disc list-outside pl-4 space-y-1">
        <li
          v-for="landmark in visibleLandmarks"
          :key="landmark.id"
          class="text-slate-300 marker:text-slate-500"
        >
          <router-link
            :to="`/app/landmarks/${landmark.id}`"
            class="group text-xs leading-[0.95rem] text-slate-200 hover:text-slate-100 transition-colors whitespace-normal break-words"
          >
            <template v-if="relatedElementsLoadingById[landmark.id]">
              <span class="text-slate-400 text-xs leading-4">Chargement...</span>
            </template>
            <template v-else-if="latestRelatedElement(landmark.id)">
              {{ latestElementDisplayText(landmark) }}
            </template>
            <template v-else>
              <span class="text-slate-500 text-xs leading-4">Aucun element</span>
            </template>
            <ShareIcon class="inline-block w-3.5 h-3.5 ml-1 text-slate-500 group-hover:text-slate-300 transition-colors align-[-2px]" />
          </router-link>
        </li>
      </ul>
      <div class="mt-2 flex justify-end">
        <router-link
          v-if="displayLandscapeAnalysis?.id"
          :to="{ name: 'analysis', params: { id: displayLandscapeAnalysis.id } }"
          class="text-xs text-slate-400 underline hover:text-slate-200 transition-colors"
        >
          voir plus
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ShareIcon } from '@heroicons/vue/24/outline'
import { fetchWrapper } from '@/helpers'
import { useLens, type Landmark } from '@/composables/useLens'

const { displayLandmarks, displayLandscapeAnalysis, isLoadingLandmarks } = useLens()
const relatedElementsLoadingById = ref<Record<string, boolean>>({})
type RelatedElement = {
  id: string
  title?: string
  subtitle?: string
  content?: string
  verb?: string
  created_at?: string | Date
}
type ThemeLandmark = { id?: string; title?: string; landmark_type?: string }
const relatedElementsByLandmarkId = ref<Record<string, RelatedElement[]>>({})
const themeTitleByElementId = ref<Record<string, string>>({})
const themeLoadingByElementId = ref<Record<string, boolean>>({})

const sortedLandmarks = computed<Landmark[]>(() => {
  return displayLandmarks.value
    .filter((landmark) => isResourceLandmark(landmark.landmark_type))
    .sort((a, b) => {
    const dateA = new Date((a as any).created_at || 0).getTime()
    const dateB = new Date((b as any).created_at || 0).getTime()
    return dateB - dateA
  })
})

const visibleLandmarks = computed<Landmark[]>(() => {
  return sortedLandmarks.value.slice(0, 4)
})

const loadRelatedElements = async (landmarkId: string) => {
  if (!landmarkId) return
  if (relatedElementsByLandmarkId.value[landmarkId] != null) return
  if (relatedElementsLoadingById.value[landmarkId]) return

  relatedElementsLoadingById.value[landmarkId] = true
  try {
    const response = await fetchWrapper.get(`/landmarks/${landmarkId}`)
    const related = Array.isArray(response.data?.related_elements) ? response.data.related_elements : []
    relatedElementsByLandmarkId.value[landmarkId] = related
  } catch (error) {
    console.error(`Error loading related elements for landmark ${landmarkId}:`, error)
    relatedElementsByLandmarkId.value[landmarkId] = []
  } finally {
    relatedElementsLoadingById.value[landmarkId] = false
  }
}

const loadThemeForElement = async (elementId: string) => {
  if (!elementId) return
  if (themeTitleByElementId.value[elementId] != null) return
  if (themeLoadingByElementId.value[elementId]) return

  themeLoadingByElementId.value[elementId] = true
  try {
    const response = await fetchWrapper.get(`/elements/${elementId}/landmarks`)
    const landmarks = Array.isArray(response.data) ? (response.data as ThemeLandmark[]) : []
    const themeLandmark = landmarks.find((landmark) => {
      const type = (landmark.landmark_type || '').toLowerCase()
      return type === 'them' || type === 'theme'
    })
    themeTitleByElementId.value[elementId] = themeLandmark?.title || 'ce thème'
  } catch (error) {
    console.error(`Error loading themes for element ${elementId}:`, error)
    themeTitleByElementId.value[elementId] = 'ce thème'
  } finally {
    themeLoadingByElementId.value[elementId] = false
  }
}

watch(
  () => visibleLandmarks.value.map((l) => l.id).join(','),
  async () => {
    await Promise.all(visibleLandmarks.value.map((l) => loadRelatedElements(l.id)))
    await Promise.all(
      visibleLandmarks.value.map(async (landmark) => {
        const elementId = latestRelatedElement(landmark.id)?.id
        if (!elementId) return
        await loadThemeForElement(elementId)
      })
    )
  },
  { immediate: true }
)

const latestRelatedElement = (landmarkId: string): RelatedElement | null => {
  const elements = relatedElementsByLandmarkId.value[landmarkId] ?? []
  if (elements.length === 0) return null
  return elements[0]
}

function isResourceLandmark(landmarkType: string | undefined): boolean {
  if (!landmarkType) return false
  const normalized = landmarkType.toLowerCase()
  return normalized === 'rsrc' || normalized === 'resource'
}

const elementVerbPrefix = (verb: string): string => {
  const normalized = verb.trim().toUpperCase()
  if (normalized.startsWith('DONE')) return "j'ai "
  if (normalized.startsWith('IN_PROGRESS')) return 'Je suis en train de '
  if (normalized.startsWith('INTENDED')) return 'Je voudrais '
  return ''
}

const elementVerbRest = (verb: string): string => {
  return verb
    .trim()
    .replace(/^(DONE|IN_PROGRESS|INTENDED)[\s:_-]*/i, '')
    .trim()
}

const extractElementVerb = (element: RelatedElement): string => {
  const candidates = [element.verb, element.subtitle, element.content, element.title]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate.trim()
  }
  return ''
}

const latestElementDisplayText = (landmark: Landmark): string => {
  const element = latestRelatedElement(landmark.id)
  if (!element) return 'Aucun element'
  const rawVerb = extractElementVerb(element)
  const prefix = elementVerbPrefix(rawVerb)
  const rest = elementVerbRest(rawVerb)
  const fallbackVerb = 'explorer'
  const verb = rest || fallbackVerb
  const resourceTitle = (landmark.title || element.title || 'cette ressource').trim()
  const themeTitle = element.id
    ? (themeTitleByElementId.value[element.id] || (themeLoadingByElementId.value[element.id] ? '...' : 'ce thème'))
    : 'ce thème'
  return `${prefix}${verb} ${resourceTitle} à propos de ${themeTitle}`.replace(/\s+/g, ' ').trim()
}

</script>
