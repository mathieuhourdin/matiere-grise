<template>
  <div>
    <div v-if="user">Nouvelle utilisation par {{ user.first_name }} {{ user.last_name }}</div>
    <ThoughtInputsList
      v-if="!selectedThoughtInput"
      :thought-inputs="thoughtInputs"
      center
      @select="(event) => selectThoughtInput(event)"
    />
    <div v-else>
      <TextAreaInput label="Pourquoi ajouter cet élément ?" v-model="usage_reason" />
      <div class="flex flex-row-reverse">
        <ActionButton type="valid" @click="localCreateThoughtInputUsage" text="Ajouter" />
        <ActionButton type="abort" @click="emit('close')" text="Ajouter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import { useUser } from '@/composables/useUser'
import { useThoughtInputs } from '@/composables/useThoughtInputs'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages'
import { ref, onMounted } from 'vue'
import { type ApiThoughtInput } from '@/types/models'
const { user } = useUser()

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  thoughtOutput: any
}>()

const thoughtInputs = ref<ApiThoughtInput[]>([])
const selectedThoughtInput = ref<ApiThoughtInput | null>(null)
const usage_reason = ref('')

const { createThoughtInputUsage } = useThoughtInputUsages()

const localCreateThoughtInputUsage = async () => {
  console.log('create')
  if (!selectedThoughtInput.value) return
  const thought_input_usage = {
    thought_output_id: props.thoughtOutput.id,
    thought_input_id: selectedThoughtInput.value.id,
    usage_reason: usage_reason.value
  }
  await createThoughtInputUsage(thought_input_usage)
  emit('refresh')
  emit('close')
}

const { getUserThoughtInputs } = useThoughtInputs()

const selectThoughtInput = (thoughtInput: ApiThoughtInput) => {
  selectedThoughtInput.value = thoughtInput
}

onMounted(async () => {
  if (!user.value || !user.value.id) return
  thoughtInputs.value = await getUserThoughtInputs(user.value.id)
})
</script>
