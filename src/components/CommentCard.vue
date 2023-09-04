<template>
  <div class="bg-slate-100 border-2 p-4 m-1 rounded p-2">
    <div class="text-xs m-1">{{ user.first_name }} {{ user.last_name }}</div>
    <div v-if="editing">
      <textarea class="w-full text-xs rounded-xl p-2" :value="modelValue" @input="onInput" />
      <div class="flex">
        <ActionButton @click="validateComment" class="text-sm" rounded size="2xs" text="Commenter" type="valid" />
        <ActionButton @click="abortComment" class="text-sm" rounded size="2xs" text="Annuler" type="abort" />
      </div>
    </div>
    <div v-else class="text-2xs">
      {{ modelValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useUser } from '@/composables/useUser.ts'
const emit = defineEmits(['update:modelValue', 'validate', 'abort'])
const props = defineProps<{
  editing: boolean
  modelValue: string
}>()
const { user } = useUser()
const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}
const validateComment = () => {
  emit('validate');
}
const abortComment = () => {
  emit('abort');
}
</script>
