<template>
  <article
    :class="[
      'h-full p-3 rounded-lg border',
      tone === 'light' ? 'border-slate-300 bg-white text-slate-800' : 'border-slate-700 bg-slate-800/40 text-slate-200'
    ]"
    :style="cardStyle"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <div class="text-sm font-semibold leading-5 break-words">
          {{ friendlyTitle }}
        </div>
        <div
          v-if="inlineSpanText"
          :class="['mt-1 text-xs leading-5 whitespace-pre-wrap break-words', tone === 'light' ? 'text-slate-700' : 'text-slate-200']"
        >
          {{ inlineSpanText }}
        </div>
        <div v-if="friendlySubtitle" :class="['mt-1 text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400']">
          {{ friendlySubtitle }}
        </div>
        <div v-if="interactionDateDisplay" :class="['mt-1 text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400']">
          {{ interactionDateDisplay }}
        </div>
      </div>
      <button
        v-if="detailLines.length > 0"
        type="button"
        :class="[
          'inline-flex items-center justify-center w-6 h-6 rounded transition-colors flex-none',
          tone === 'light' ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
        ]"
        @click="expanded = !expanded"
      >
        <ChevronDownIcon class="w-4 h-4 transition-transform" :class="expanded ? 'rotate-180' : ''" />
      </button>
    </div>

    <div v-if="hasMetaSlot" class="mt-2">
      <slot name="meta" />
    </div>

    <div v-if="normalizedAssociatedLandmarks.length > 0" class="mt-2 flex flex-wrap gap-1.5">
      <template v-for="landmark in normalizedAssociatedLandmarks" :key="landmark.key">
        <router-link
          v-if="landmark.id"
          :to="`/app/landmarks/${landmark.id}`"
          :class="[
            'text-[10px] px-1.5 py-0.5 rounded-full border transition-colors',
            tone === 'light'
              ? 'border-slate-300 text-slate-600 bg-slate-100/70 hover:border-slate-400 hover:text-slate-800'
              : 'border-slate-600 text-slate-300 bg-slate-900/60 hover:border-slate-500 hover:text-slate-100'
          ]"
        >
          {{ landmark.title }}
        </router-link>
        <span
          v-else
          :class="[
            'text-[10px] px-1.5 py-0.5 rounded-full border',
            tone === 'light'
              ? 'border-slate-300 text-slate-600 bg-slate-100/70'
              : 'border-slate-600 text-slate-300 bg-slate-900/60'
          ]"
        >
          {{ landmark.title }}
        </span>
      </template>
    </div>

    <div v-if="normalizedRelationChips.length > 0" class="mt-2 flex flex-wrap gap-1.5">
      <span
        v-for="relation in normalizedRelationChips"
        :key="relation.key"
        :class="[
          'inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border',
          tone === 'light'
            ? 'border-slate-300 text-slate-600 bg-slate-100/70'
            : 'border-slate-600 text-slate-300 bg-slate-900/60'
        ]"
      >
        <span class="uppercase tracking-wide opacity-80">{{ relation.relationType }}</span>
        <span :class="tone === 'light' ? 'text-slate-700 font-medium' : 'text-slate-100 font-medium'">
          {{ relation.title }}
        </span>
      </span>
    </div>

    <div v-if="expanded && detailLines.length > 0" :class="['mt-2 space-y-1 text-xs', tone === 'light' ? 'text-slate-600' : 'text-slate-300']">
      <div v-for="(line, index) in detailLines" :key="`line-${index}`">
        {{ line }}
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { fetchWrapper } from '@/helpers'

type AssociatedLandmark = {
  id?: string
  title?: string
}

const props = withDefaults(defineProps<{
  element: Record<string, any>
  associatedLandmarks?: AssociatedLandmark[]
  accentColor?: string
  showId?: boolean
  initiallyExpanded?: boolean
  tone?: 'dark' | 'light'
}>(), {
  associatedLandmarks: () => [],
  accentColor: '',
  showId: false,
  initiallyExpanded: false,
  tone: 'dark'
})

const slots = useSlots()
const expanded = ref(props.initiallyExpanded)
const elementRelations = ref<any[]>([])
const relationsRequestIndex = ref(0)

const hasMetaSlot = computed(() => Boolean(slots.meta))

const normalizedAssociatedLandmarks = computed(() => {
  const landmarks = Array.isArray(props.associatedLandmarks) ? props.associatedLandmarks : []
  return landmarks
    .map((landmark, index) => {
      const id = landmark?.id != null ? String(landmark.id).trim() : ''
      const title = typeof landmark?.title === 'string' ? landmark.title.trim() : ''
      const safeTitle = title || 'Sans nom'
      const key = id || `${safeTitle}-${index}`
      return { id, title: safeTitle, key }
    })
    .filter((landmark) => landmark.title.length > 0)
})

const apiElementId = computed(() => {
  const candidates = [
    props.element?.id,
    props.element?.resource?.id,
    props.element?.element_id,
    props.element?.elementId
  ]
  for (const candidate of candidates) {
    if (candidate == null) continue
    const value = String(candidate).trim()
    if (value.length > 0) return value
  }
  return ''
})

const toDisplayValue = (value: unknown): string => {
  if (value == null) return ''
  const normalized = String(value).trim()
  return normalized
}

const relationTypeValue = (relation: any): string => {
  const relationType = [
    relation?.relation_type,
    relation?.relationType,
    relation?.type,
    relation?.relation?.relation_type,
    relation?.relation?.relationType,
    relation?.element_type,
    relation?.elementType
  ]
    .map((value: unknown) => toDisplayValue(value))
    .find((value: string) => value.length > 0)
  if (!relationType) return 'relation'
  return relationType.replace(/[_-]+/g, ' ')
}

const relationTitleValue = (relation: any): string => {
  if (!relation || typeof relation !== 'object') return ''
  const candidates = [
    relation?.title,
    relation?.name,
    relation?.display_name,
    relation?.displayName,
    relation?.mention,
    relation?.resource?.title,
    relation?.element?.title,
    relation?.target_resource?.title,
    relation?.origin_resource?.title,
    relation?.target_element?.title,
    relation?.origin_element?.title,
    relation?.data?.title,
    relation?.landmark?.title,
    relation?.target_landmark?.title,
    relation?.related_landmark?.title
  ]
    .map((value: unknown) => toDisplayValue(value))
    .find((value: string) => value.length > 0)
  return candidates ?? ''
}

const normalizedRelationChips = computed(() => {
  const seen = new Set<string>()
  const chips: Array<{ key: string, relationType: string, title: string }> = []

  elementRelations.value.forEach((relation, index) => {
    const title = typeof relation === 'string' ? relation.trim() : relationTitleValue(relation)
    if (!title) return
    const relationType = typeof relation === 'string' ? 'relation' : relationTypeValue(relation)
    const relationId = relation?.id != null ? String(relation.id).trim() : ''
    const key = relationId || `${relationType}-${title}-${index}`
    const dedupeKey = `${relationId}|${relationType}|${title}`
    if (seen.has(dedupeKey)) return
    seen.add(dedupeKey)
    chips.push({ key, relationType, title })
  })

  return chips
})

const normalizeRelationsPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const directCandidates = [
    payload?.relations,
    payload?.data,
    payload?.items,
    payload?.results
  ]
  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate
  }

  if (payload?.data && typeof payload.data === 'object') {
    const nested = payload.data
    const nestedCandidates = [
      nested?.data,
      nested?.relations,
      nested?.items,
      nested?.results
    ]
    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) return candidate
    }
    if (
      nested?.id != null ||
      nested?.title != null ||
      nested?.relation_type != null ||
      nested?.type != null
    ) {
      return [nested]
    }
  }

  if (
    payload?.id != null ||
    payload?.title != null ||
    payload?.relation_type != null ||
    payload?.type != null
  ) {
    return [payload]
  }

  const values = Object.values(payload).filter((value) => value && typeof value === 'object')
  if (values.length > 0) return values as any[]

  return []
}

const fetchElementRelations = async (elementId: string) => {
  if (!elementId) {
    elementRelations.value = []
    return
  }
  const currentRequest = relationsRequestIndex.value + 1
  relationsRequestIndex.value = currentRequest
  try {
    const response = await fetchWrapper.get(`/elements/${elementId}/relations`)
    const normalized = normalizeRelationsPayload(response?.data)
    if (relationsRequestIndex.value !== currentRequest) return
    elementRelations.value = normalized
  } catch (_error) {
    if (relationsRequestIndex.value !== currentRequest) return
    elementRelations.value = []
  }
}

watch(apiElementId, (elementId) => {
  fetchElementRelations(elementId)
}, { immediate: true })

const cardStyle = computed(() => {
  if (!props.accentColor) return undefined
  return { borderColor: props.accentColor }
})

const decodeJsonEncodedContent = (content: unknown): any | null => {
  if (typeof content !== 'string') return null
  let current: any = content.trim()
  if (!current) return null

  for (let depth = 0; depth < 3; depth++) {
    if (typeof current !== 'string') return current
    const trimmed = current.trim()
    if (!trimmed) return null
    const startsLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')
    if (!startsLikeJson) return depth === 0 ? null : current
    try {
      current = JSON.parse(trimmed)
    } catch (_error) {
      return depth === 0 ? null : current
    }
  }
  return current
}

const decodedContent = computed(() => {
  return decodeJsonEncodedContent(props.element?.content ?? props.element?.resource?.content ?? '')
})

const field = (snake: string, camel?: string): any => {
  const decoded = decodedContent.value
  if (decoded && typeof decoded === 'object') {
    if ((decoded as any)[snake] != null) return (decoded as any)[snake]
    if (camel && (decoded as any)[camel] != null) return (decoded as any)[camel]
  }
  if (props.element?.[snake] != null) return props.element[snake]
  if (camel && props.element?.[camel] != null) return props.element[camel]
  return null
}

const spanValues = computed<string[]>(() => {
  const raw = field('spans') ?? field('span')
  if (Array.isArray(raw)) {
    return raw
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value) => value.length > 0)
  }
  if (typeof raw === 'string' && raw.trim().length > 0) return [raw.trim()]
  return []
})

const status = computed(() => {
  const raw = field('status')
  return typeof raw === 'string' ? raw.trim().toUpperCase() : ''
})

const verb = computed(() => {
  const raw = field('verb')
  return typeof raw === 'string' ? raw.trim() : ''
})

const target = computed(() => {
  const raw = field('target')
  return typeof raw === 'string' ? raw.trim() : ''
})

const friendlyFromVerb = computed(() => {
  if (!verb.value && !target.value) return ''
  const action = [verb.value, target.value].filter(Boolean).join(' ').trim()
  if (!action) return ''
  if (status.value === 'DONE') return `J'ai ${action}`
  if (status.value === 'IN_PROGRESS') return `Je suis en train de ${action}`
  if (status.value === 'INTENDED') return `Je voudrais ${action}`
  return action
})

const explicitTitle = computed(() => {
  const value = props.element?.title ?? props.element?.resource?.title ?? ''
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : ''
})

const friendlyTitle = computed(() => {
  if (explicitTitle.value) return explicitTitle.value
  if (friendlyFromVerb.value) return friendlyFromVerb.value
  if (spanValues.value.length > 0) return spanValues.value[0]
  const fallback = props.element?.title ?? props.element?.resource?.title ?? ''
  return typeof fallback === 'string' && fallback.trim().length > 0 ? fallback.trim() : 'Élément'
})

const inlineSpanText = computed(() => {
  if (spanValues.value.length === 0) return ''
  const firstSpan = spanValues.value[0]
  if (!firstSpan) return ''
  if (firstSpan.trim() === friendlyTitle.value.trim()) return ''
  return firstSpan
})

const friendlySubtitle = computed(() => {
  const theme = field('theme')
  const kind = field('kind')
  const parts = [theme, kind]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0)
  return parts.join(' · ')
})

const interactionDateDisplay = computed(() => {
  const raw = field('interaction_date', 'interactionDate') ?? field('created_at', 'createdAt')
  if (!raw) return ''
  const date = new Date(String(raw))
  if (!Number.isNaN(date.getTime())) {
    return `interaction: ${date.toLocaleString()}`
  }
  const fallback = String(raw).trim()
  return fallback ? `interaction: ${fallback}` : ''
})

const toDisplayString = (value: any): string => {
  if (value == null) return ''
  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => toDisplayString(entry))
      .filter((entry) => entry.length > 0)
    return parts.join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (_error) {
      return ''
    }
  }
  return String(value).trim()
}

const detailLines = computed(() => {
  const lines: string[] = []
  const id = toDisplayString(field('id'))
  const elementType = toDisplayString(field('element_type', 'elementType'))
  const elementSubtype = toDisplayString(field('element_subtype', 'elementSubtype'))
  const statusValue = toDisplayString(field('status'))
  const verbValue = toDisplayString(field('verb'))
  const targetValue = toDisplayString(field('target'))
  const themeValue = toDisplayString(field('theme'))
  const scopeValue = toDisplayString(field('scope'))
  const lifeDomainValue = toDisplayString(field('life_domain', 'lifeDomain'))
  const dateOffsetValue = toDisplayString(field('date_offset', 'dateOffset'))
  const refsTagsValue = toDisplayString(field('references_tags_id', 'referencesTagsId'))

  if (props.showId && id) lines.push(`id: ${id}`)
  if (elementType && elementSubtype) lines.push(`type: ${elementType} / ${elementSubtype}`)
  else if (elementType) lines.push(`type: ${elementType}`)
  else if (elementSubtype) lines.push(`type: ${elementSubtype}`)
  if (statusValue) lines.push(`status: ${statusValue}`)
  if (verbValue) lines.push(`verbe: ${verbValue}`)
  if (targetValue) lines.push(`cible: ${targetValue}`)
  if (themeValue) lines.push(`thème: ${themeValue}`)
  if (scopeValue) lines.push(`scope: ${scopeValue}`)
  if (lifeDomainValue) lines.push(`domaine: ${lifeDomainValue}`)
  if (dateOffsetValue) lines.push(`temporalité: ${dateOffsetValue}`)
  if (interactionDateDisplay.value) lines.push(interactionDateDisplay.value)
  if (refsTagsValue) lines.push(`references_tags_id: ${refsTagsValue}`)
  if (spanValues.value.length > 1) lines.push(`spans: ${spanValues.value.slice(1).join(' | ')}`)

  return lines
})
</script>
