<template>
  <div class="w-full flex h-16 md:h-12 bg-slate-300 dark:bg-elevated rounded-t border-b border-b-slate-400 dark:border-gray-600 shadow transition-colors duration-200">
    <div class="basis-1/2 md:basis-1/3 flex">
      <Bars3Icon @click="toggleMenuOpen" class="p-1 md:p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200" />
      <FeedFilter v-if="isFeedRoute" class="my-auto bg-slate-300 dark:bg-elevated" />
      <BaseLink v-else class="md:ml-4 my-auto mr-auto text-xs md:text-base text-gray-800 dark:text-gray-200"
        >🫀 Matieres Grises</BaseLink
      >
    </div>
    <div class="my-auto grow text-center">
      <router-link
        v-if="headerValue"
        :to="headerValue?.link || ''"
        class="text-2xs md:text-base md:font-bold text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
        >{{ headerValue?.text }}</router-link
      >
    </div>
    <div class="md:basis-1/3 basis-1/2 flex">
      <DraftsNotifications class="my-auto ml-auto w-8 mr-1 md:mr-2 border border-black dark:border-gray-400 border-2" />
      <ReviewsNotifications class="my-auto w-8 mr-1 md:mr-2 border border-black dark:border-gray-400 border-2" />
      <UserManagement class="mr-1 md:mr-4 my-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FeedFilter from '@/components/Feed/FeedFilter.vue'
import ReviewsNotifications from '@/components/App/ReviewsNotifications.vue'
import DraftsNotifications from '@/components/App/DraftsNotifications.vue'
import UserManagement from '@/components/App/UserManagement.vue'
import BaseLink from '@/components/Ui/BaseLink.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useMenu } from '@/composables/useMenu'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const { toggleMenuOpen, headerValue, isMobile } = useMenu()

const route = useRoute()
const isFeedRoute = computed(() => {
  return route.name === 'socialResourceFeed' || route.name === 'meResourceFeed' || route.name === 'feed' || route.name === 'userFeed'
})
</script>
