<template>
  <div class="bg-slate-100 border p-1 m-1 rounded shadow-xl">
    <div class="flex">
      <div v-if="author" class="text-xs mt-0.5 mb-1 font-bold flex">
        <img
          v-if="author.profile_picture_url"
          class="h-5 w-5 rounded-full mr-1"
          :src="author.profile_picture_url"
        />
        <div class="my-auto">{{ author.first_name }} {{ author.last_name }}</div>
      </div>
      <div class="text-2xs italic ml-auto mr-1 my-auto">{{ formattedDate }}</div>
    </div>
    <div v-if="editing">
      <textarea class="w-full text-xs rounded-xl p-2" :value="modelValue" @input="onInput" />
      <div class="flex">
        <ActionButton
          @click="validateComment"
          class="text-sm"
          rounded
          size="2xs"
          type="valid"
        >Commenter</ActionButton>
        <ActionButton
          @click="abortComment"
          class="text-sm"
          rounded
          size="2xs"
          type="abort"
        >Annuler</ActionButton>
      </div>
    </div>
    <div v-else class="text-xs mt-0.5">
      {{ modelValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue'
import { type User } from '@/types/models'
import { computed, toRefs } from 'vue'
const emit = defineEmits(['update:modelValue', 'validate', 'abort'])
const props = defineProps<{
  editing: boolean
  modelValue: string
  author?: User
  createdAt?: Date
}>()
const formattedDate = computed(() => {
  if (!props.createdAt) return ''
  return props.createdAt.toLocaleString('fr-FR', {
    hour: 'numeric',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
})
const onInput = (event: any) => {
  emit('update:modelValue', event.target.value)
}
const validateComment = () => {
  emit('validate')
}
const abortComment = () => {
  emit('abort')
}
</script>
