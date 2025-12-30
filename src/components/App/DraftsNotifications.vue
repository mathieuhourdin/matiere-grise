<template>
  <RoundLinkButton
    :to="user ? '/social/users/' + user.id + '?feed_filter=draft' : ''"
    color="slate-light"
    class="relative"
    ><template #chip
      ><div
        v-if="draftsCount > 0"
        class="absolute text-xs top-0 right-0 rounded-full w-3.5 h-3.5 bg-red-600 text-white"
      >
        {{ draftsCount }}
      </div></template
    ><PencilSquareIcon
  /></RoundLinkButton>
</template>

<script setup lang="ts">
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'

const { user } = useUser()
const { getInteractions } = useInteraction()

const draftsCount = ref(0)

const calculateDraftsCount = async () => {
  if (!user.value) return
  const drafts = await getInteractions({
    maturing_state: 'drft',
    interaction_type: 'outp',
    interaction_user_id: user.value.id
  })
  console.log(drafts)
  draftsCount.value = drafts.length
}

onMounted(async () => {
  await calculateDraftsCount()
})

watch(user, async () => {
  await calculateDraftsCount()
})
</script>
