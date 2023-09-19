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
      <div class="ml-auto h-6 m-4 w-1/3">
        <SelectInput
          label="Catégorie"
          :choices="categoryOptions"
          :model-value="problem.category_id"
          @update:modelValue="(event) => emitChange('category_id', event)"
        />
      </div>
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
import SelectInput from '@/components/Ui/SelectInput.vue'
import TextInput from '@/components/Ui/TextInput.vue'
import NumberInput from '@/components/Ui/NumberInput.vue'
import { useCategories } from '@/composables/useCategories.ts'
import { Problem } from '@/types/models'
import { computed } from 'vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  problem: Problem
}>()

const { categories } = useCategories();
const categoryOptions = computed(() => {
  return categories.value.map((category) => ({ text: category.display_name, value: category.id }))
})
const emitChange = (field, event) => {
  let problem = { ...props.problem }
  problem[field] = event
  emit('change', problem)
}
</script>
