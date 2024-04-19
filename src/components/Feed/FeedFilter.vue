<template>
  <div>
    <SelectInput text="Type de ressources" class="bg-slate-300" :choices="choices" v-model="feedFilter"/>
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/Ui/SelectInput.vue'
import { useMenu } from '@/composables/useMenu'
import { ref } from 'vue'
const { feedFilter } = useMenu()

const choices = ref<any[]>([
  { text: 'Tous', value: 'all' },
  { text: 'Production', value: 'production' },
  { text: 'Problématiques', value: 'problem' },
  { text: 'Biblio', value: 'biblio' }
])
</script>
