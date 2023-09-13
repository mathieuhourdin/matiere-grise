<template>
  <div>
    <TextInput
      label="Titre"
      :modelValue="problem.title"
      @update:modelValue="(event) => emitChange('title', event)"
    />
    <TextInput
      class="h-6"
      label="Description"
      :modelValue="problem.description"
      @update:modelValue="(event) => emitChange('description', event)"
    />
    <div class="flex">
      <NumberInput
        class="mr-auto h-6"
        label="Progression"
        :modelValue="problem.progress"
        @update:modelValue="(event) => emitChange('progress', event)"
      />
    </div>
    <div class="flex">
      <TextInput
        class="h-6"
        label="Lien image"
        :modelValue="problem.image_url"
        @update:modelValue="(event) => emitChange('image_url', event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import { Problem } from '@/types/models'

const emit = defineEmits(['change'])
const props = defineProps<{
  problem: Problem
}>()

const emitChange = (field, event) => {
  let problem = { ...props.problem }
  problem[field] = event
  emit('change', problem)
}
</script>
