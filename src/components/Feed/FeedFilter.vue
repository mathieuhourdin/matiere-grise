<template>
  <div>
    <SelectInput
      text="Type de ressources"
      class="bg-slate-300"
      :choices="choices"
      v-model="feedFilter"
    />
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import { useMenu } from '@/composables/useMenu'
import { useUser } from '@/composables/useUser'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const { feedFilter } = useMenu()

const route = useRoute()
const { user } = useUser()

const isOnLoggedInUserPage = computed(() => {
  return route.name === 'userFeed' && route.params.pageUserId === user.value.id
})

const choices = computed(() => {
  return [
    { text: 'Tous', value: 'all' },
    { text: 'Production', value: 'production' },
    { text: 'Problématiques', value: 'problem' },
    { text: 'Biblio', value: 'biblio' },
    route &&
      user.value &&
      route.name === 'userFeed' &&
      route.params.pageUserId === user.value.id && { text: 'Brouillons', value: 'draft' },
    route &&
      user.value &&
      route.name === 'userFeed' &&
      route.params.pageUserId === user.value.id && { text: 'Reviews', value: 'reviews' }
  ].filter(Boolean)
})

const loadRouteParam = () => {
  console.log('loadRouteParam')
  if (route.query.feed_filter && typeof route.query.feed_filter === 'string') {
    feedFilter.value = route.query.feed_filter
  }
}
watch(
  route,
  () => {
    loadRouteParam()
    if (
      route.name !== 'userFeed' &&
      (feedFilter.value === 'draft' || feedFilter.value === 'reviews')
    ) {
      feedFilter.value = 'all'
    }
  },
  { deep: true }
)
onMounted(() => {
  console.log('useMenu mounted')
  loadRouteParam()
})
</script>
