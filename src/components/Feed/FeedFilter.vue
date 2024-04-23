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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const { feedFilter } = useMenu()

const route = useRoute()
const { user } = useUser()

const isOnLoggedInUserPage = computed(() => {
  return route.name === 'userFeed' && router.params.pageUserId === user.value.id
})

const choices = computed(() => {
  return [
    { text: 'Tous', value: 'all' },
    { text: 'Production', value: 'production' },
    { text: 'Problématiques', value: 'problem' },
    { text: 'Biblio', value: 'biblio' },
    route && route.name === 'userFeed' &&
      route.params.pageUserId === user.value.id && { text: 'Brouillons', value: 'draft' }
  ].filter( Boolean)
})
</script>
