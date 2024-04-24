<template>
  <div class="w-full flex h-12 bg-slate-300 rounded-t border-b border-b-slate-400 shadow">
    <div class="basis-1/2 md:basis-1/3 flex">
      <Bars3Icon @click="toggleMenuOpen" class="p-1 md:p-2" />
      <FeedFilter v-if="isFeedRoute" class="my-auto bg-slate-300" />
      <BaseLink v-else class="md:ml-4 my-auto mr-auto text-xs md:text-base">🫀 Matiere Grise</BaseLink>
    </div>
    <div class="my-auto grow text-center">
      <router-link v-if="headerValue" :to="headerValue.link" class="text-2xs md:text-base md:font-bold">{{ headerValue.text }}</router-link>
    </div>
    <div class="md:basis-1/3 basis-1/2 flex flex-row-reverse">
      <UserManagement class="mr-1 md:mr-4 my-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import FeedFilter from '@/components/Feed/FeedFilter.vue'
import UserManagement from '@/components/App/UserManagement.vue'
import BaseLink from '@/components/Ui/BaseLink.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useMenu } from '@/composables/useMenu'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const { toggleMenuOpen, headerValue, isMobile } = useMenu()

const route = useRoute()
const isFeedRoute = computed(() => {
  return route.name === "resourceFeed" || route.name === "feed" || route.name === "userFeed"
})
</script>
