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
      :modelValue="problem.subtitle"
      @update:modelValue="(event) => emitChange('subtitle', event)"
    />
    <div class="flex">
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
import { useCategories } from '@/composables/useCategories'
import { type Resource } from '@/types/models'
import { computed } from 'vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  problem: Resource
}>()

const { categories } = useCategories();
const categoryOptions = computed(() => {
  return categories.value.map((category) => ({ text: category.display_name, value: category.id }))
})
const emitChange = (field: string, event: any) => {
  let problem: any = { ...props.problem }
  problem[field] = event
  emit('change', problem)
}
</script>
