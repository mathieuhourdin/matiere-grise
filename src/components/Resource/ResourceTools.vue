<template>
  <div>
    <RoundLinkButton v-if="isResourceEditable && toolsOpen" title="Modifier" @click="emit('edit')"
      ><PencilSquareIcon class="m-1"
    /></RoundLinkButton>
    <RoundLinkButton
      class="mt-2"
      color="blue"
      title="Demander une review"
      v-if="isResourceEditable && toolsOpen"
      @click="openAddReview = true"
      ><BookOpenIcon class="m-1"
    /></RoundLinkButton>
    <ModalSheet :open="openAddReview" @close="openAddReview = false">
      <CreateReview
        @refresh="emit('refresh')"
        @close="openAddReview = false"
        :resource="resource"
      />
    </ModalSheet>
    <RoundLinkButton
      class="mt-2"
      color="red"
      title="Marquer comme lu"
      v-if="isResourceEditable && toolsOpen"
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
      v-if="isResourceEditable && toolsOpen"
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
    <RoundLinkButton class="mt-2" color="gray" @click="toolsOpen = !toolsOpen"
      ><WrenchIcon
    /></RoundLinkButton>
  </div>
</template>
<script setup lang="ts">
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import CreateResourceRelationForm from '@/components/Resource/CreateResourceRelationForm.vue'
import CreateInteraction from '@/components/CreateInteraction.vue'
import CreateReview from '@/components/Resource/CreateReview.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import {
  BookOpenIcon,
  WrenchIcon,
  PencilSquareIcon,
  ArrowDownOnSquareIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { type Resource } from '@/types/models'

const emit = defineEmits(['refresh', 'edit'])

const props = defineProps<{
  resource: Resource
  isResourceEditable: boolean
}>()

const toolsOpen = ref<boolean>(false)

const openAddReview = ref<boolean>(false)
const openAddInteraction = ref<boolean>(false)
const openAddResourceRelationAsOrigin = ref<boolean>(false)
</script>
