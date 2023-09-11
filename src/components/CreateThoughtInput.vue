<template>
  <div>
    <div>Nouvel apport</div>
    <TextInput label="titre de l'ouvrage" v-model="thoughtInput.resource_title" />
    <div class="flex flex-wrap">
      <TextInput
        class="h-8 mx-auto"
        label="Nom de l'auteur"
        v-model="thoughtInput.resource_author_name"
      />
      <TextInput
        class="h-8 mx-auto"
        label="type de resource"
        v-model="thoughtInput.resource_type"
      />
    </div>
    <div class="flex flex-wrap">
      <TextInput
        class="h-8 mx-auto"
        label="Lien de la ressource"
        v-model="thoughtInput.resource_link"
      />
      <TextInput
        class="h-8 mx-auto"
        label="Lien de l'image"
        v-model="thoughtInput.resource_image_link"
      />
    </div>
    <TextInput label="Commentaire sur l'ouvrage" v-model="thoughtInput.resource_comment" />
    <TextInput label="Avancement de l'ouvrage" v-model="thoughtInput.input_progress" type="number"/>
    <TextInput label="Date de lecture" v-model="thoughtInput.input_date" type="date" />
    <TextInput label="Pourquoi s'y être interessé ?" v-model="thoughtInput.input_comment" />
    <div class="flex flex-row-reverse">
      <ActionButton
        @click="validate"
        class="m-4"
        text="Valider"
        type="valid"
      />
      <ActionButton @click="emitClose" class="m-4" text="Annuler" type="abort" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { ref } from 'vue'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'

const emit = defineEmits(['close'])

const { newThoughtInput, createThoughtInput } = useThoughtInputs()

const thoughtInput = ref(newThoughtInput())

const validate = () => {
  createThoughtInput(thoughtInput.value)
  emitClose()
}

const emitClose = () => emit('close')
</script>
