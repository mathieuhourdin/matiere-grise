<template>
  <RoundLinkButton
    :to="user ? '/social/users/' + user.id + '?feed_filter=reviews' : ''"
    color="slate-light"
    class="relative"
    ><template #chip
      ><div
        v-if="reviewsCount > 0"
        class="absolute text-xs top-0 right-0 rounded-full w-3.5 h-3.5 bg-red-600 text-white"
      >
        {{ reviewsCount }}
      </div></template
    ><BookOpenIcon
  /></RoundLinkButton>
</template>

<script setup lang="ts">
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import { BookOpenIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useInteraction } from '@/composables/useInteraction'

const { user } = useUser()
const { getInteractions } = useInteraction()

const reviewsCount = ref(0)

const calculateReviewsCount = async () => {
  if (!user.value) return
  const reviews = await getInteractions({
    interaction_type: 'rvew',
    interaction_user_id: user.value.id
  })
  reviewsCount.value = reviews.length
}

onMounted(async () => {
  await calculateReviewsCount()
})

watch(user, async () => await calculateReviewsCount())
</script>
