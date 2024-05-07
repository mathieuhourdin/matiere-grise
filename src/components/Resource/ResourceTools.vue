
<template>
  <div>
        <RoundLinkButton
          v-if="isResourceEditable"
          title="Modifier"
          @click="emit('edit')"
          ><PencilSquareIcon class="m-1"
        /></RoundLinkButton>
        <RoundLinkButton
          class="mt-2"
          color="red"
          title="Marquer comme lu"
          v-if="isResourceEditable"
          @click="openAddInteraction = true"
          ><ArrowDownOnSquareIcon class="m-1"
        /></RoundLinkButton>
        <ModalSheet :open="openAddInteraction" @close="openAddInteraction = false">
          <CreateInteraction
            @refresh="emit('refresh')"
            @close="openAddInteraction = false"
            :resource="resource"
          />
        </ModalSheet>
        <RoundLinkButton
          class="mt-2"
          color="green"
          title="Relier à d'autres ressources"
          v-if="isResourceEditable"
          @click="openAddResourceRelationAsOrigin = true"
          ><ShareIcon class="m-1"
        /></RoundLinkButton>
        <ModalSheet
          :open="openAddResourceRelationAsOrigin"
          @close="openAddResourceRelationAsOrigin = false"
        >
          <CreateResourceRelationForm
            @refresh="emit('refresh')"
            @close="openAddResourceRelationAsOrigin = false"
            :origin-resource="resource"
          />
        </ModalSheet>
  </div>
</template>
<script setup lang="ts">
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateResourceRelationForm from '@/components/Resource/CreateResourceRelationForm.vue'
import CreateInteraction from '@/components/CreateInteraction.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import { PencilSquareIcon, ArrowDownOnSquareIcon, ShareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { type Resource } from '@/types/models'

const emit = defineEmits(["refresh", "edit"])

const props = defineProps<{
  resource: Resource,
  isResourceEditable: boolean
}>();

const openAddInteraction = ref<boolean>(false)
const openAddResourceRelationAsOrigin = ref<boolean>(false)


  </script>
