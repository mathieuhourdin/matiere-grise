<template>
  <div>
    <div>{{ user.first_name }}</div>
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
import { useUser } from '@/composables/useUser.ts'
import { useThoughtInputs } from '@/composables/useThoughtInputs.ts'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages.ts'
import { ref, onMounted } from 'vue'
const { user } = useUser()

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  thoughtOutput: any
}>()

const thoughtInputs = ref([])
const selectedThoughtInput = ref(null)
const usage_reason = ref('')

const { createThoughtInputUsage } = useThoughtInputUsages()

const localCreateThoughtInputUsage = async () => {
  console.log('create')
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

const selectThoughtInput = (thoughtInput) => {
  selectedThoughtInput.value = thoughtInput
}

onMounted(async () => (thoughtInputs.value = await getUserThoughtInputs(user.value.id)))
</script>
