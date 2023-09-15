<template>
  <div class="m-4">
    <div>Derniers apports</div>
    <div class="italic underline text-xs" @click="openNewThoughtInput = true">
      Ajouter un nouvel apport
    </div>
    <ModalSheet :open="openNewThoughtInput" @close="openNewThoughtInput = false">
      <CreateThoughtInput @close="openNewThoughtInput = false" />
    </ModalSheet>
    <ThoughtInputsList :thought-inputs="thoughtInputs" />
  </div>
</template>

<script setup lang="ts">
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateThoughtInput from '@/components/CreateThoughtInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'
import { ref, onMounted } from 'vue'

const openNewThoughtInput = ref(false)

const { getThoughtInputs } = useThoughtInputs()

const thoughtInputs = ref([])

onMounted(async () => {
  thoughtInputs.value = await getThoughtInputs()
})
</script>
