<template>
  <div>
    <div>Nouvel apport</div>
    <TextInput label="Titre de l'ouvrage" v-model="thoughtInput.resource.title" />
    <div class="flex flex-wrap">
      <TextInput
        class="h-8 w-full md:w-5/12"
        label="Sous-titre"
        v-model="thoughtInput.resource.subtitle"
      />
      <SelectInput
        label="Type de ressource"
        class="m-4 h-8 w-full md:w-5/12 md:ml-auto"
        :choices="resourceTypeOptions"
        v-model="thoughtInput.resource.resource_type"
      />
    </div>
    <div class="flex flex-wrap">
      <TextInput
        class="h-8 w-full md:w-5/12"
        label="Lien de la ressource"
        v-model="thoughtInput.resource.external_content_url"
      />
      <TextInput
        class="h-8 w-full md:w-5/12 md:ml-auto"
        label="Lien de l'image"
        v-model="thoughtInput.resource.image_url"
      />
    </div>
    <TextInput label="Commentaire sur l'ouvrage" v-model="thoughtInput.resource.comment" />
    <TextInput
      label="Avancement de l'ouvrage"
      v-model="thoughtInput.interaction_progress"
      type="number"
    />
    <TextInput label="Date de lecture" v-model="thoughtInput.interaction_date" type="date" />
    <TextInput label="Pourquoi s'y être interessé ?" v-model="thoughtInput.interaction_comment" />
    <div class="flex flex-row-reverse">
      <ActionButton @click="validate" class="m-4" text="Valider" type="valid" />
      <ActionButton @click="emitClose" class="m-4" text="Annuler" type="abort" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import SelectInput from '@/components/Ui/SelectInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref } from 'vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs'

const emit = defineEmits(['close', 'refresh'])

const { newThoughtInput, createThoughtInput } = useThoughtInputs()

const thoughtInput = ref(newThoughtInput())

const validate = async () => {
  await createThoughtInput(thoughtInput.value)
  emit('refresh')
  emitClose()
}

const resourceTypeOptions = ref([
  { text: 'Livre', value: 'book' },
  { text: 'Fiche de lecture', value: 'shet' },
  { text: 'Article de média', value: 'natc' },
  { text: 'Article de recherche', value: 'ratc' },
  { text: 'Film', value: 'movi' },
  { text: 'Podcast', value: 'pcst' }
])

const emitClose = () => emit('close')
</script>
