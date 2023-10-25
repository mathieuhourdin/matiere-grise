<template>
  <div>
    <div v-if="user">Nouvelle utilisation par {{ user.first_name }} {{ user.last_name }}</div>
    <ThoughtInputsList
      v-if="!selectedOriginResource"
      :contextual-resources="contextualResources"
      center
      @select="(event) => selectThoughtInput(event)"
    />
    <div v-else>
      <TextAreaInput label="Pourquoi ajouter cet élément ?" v-model="relation_comment" />
      <div class="flex flex-row-reverse">
        <ActionButton type="valid" @click="localCreateResourceRelation" text="Ajouter" />
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
import { useResourceRelations } from '@/composables/useResourceRelations'
import { ref, computed, onMounted } from 'vue'
import { type ApiInteraction, type ApiResource } from '@/types/models'
const { user } = useUser()

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  thoughtOutput: any
}>()

const thoughtInputs = ref<ApiInteraction[]>([])
const selectedOriginResource = ref<ApiResource | null>(null)
const relation_comment = ref('')

const { createResourceRelation } = useResourceRelations()

const contextualResources = computed(() => {
  return thoughtInputs.value.map((thoughtInput) => {
    return {
      resource: thoughtInput.resource,
    }
  })
})

const localCreateResourceRelation = async () => {
  console.log('create')
  if (!selectedOriginResource.value) return
  const thought_input_usage = {
    target_resource_id: props.thoughtOutput.id,
    origin_resource_id: selectedOriginResource.value.id,
    relation_comment: relation_comment.value
  }
  await createResourceRelation(thought_input_usage)
  emit('refresh')
  emit('close')
}

const { getUserThoughtInputs } = useThoughtInputs()

const selectThoughtInput = (contextualResource: ContextualResource) => {
  selectedOriginResource.value = contextualResource.resource
}

onMounted(async () => {
  if (!user.value || !user.value.id) return
  thoughtInputs.value = await getUserThoughtInputs(user.value.id)
})
</script>
