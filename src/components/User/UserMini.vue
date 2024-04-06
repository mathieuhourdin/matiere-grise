<template>
  <router-link class="flex mb-1.5 h-8" :to="user ? '/users/' + user.id : '/'">
    <UserAvatar class="my-auto" :user="user" />
    <div class="h-full flex flex-col w-full">
      <div class="flex w-auto my-auto shrink overflow-auto">
        <div v-if="user" class="sm:text-xs text-base font-semibold ml-2">
          {{ user.first_name }} {{ user.last_name }}
        </div>
        <div v-else class="sm:text-xs text-sm italic ml-2">Connectez vous pour voir l'auteur</div>
        <div v-if="secondText" class="mx-1 my-auto rounded-full bg-gray-800 w-1 h-1"></div>
        <div v-if="secondText" class="text-2xs my-auto">{{ secondText }}</div>
      </div>
      <div v-if="firstBottomText" class="flex ml-2 grow shrink-0 overflow-auto">
        <div class="text-xs my-auto italic">
          {{ firstBottomText }}
        </div>
        <div v-if="secondBottomText" class="mx-1 my-auto rounded-full bg-gray-800 w-1 h-1"></div>
        <div v-if="secondBottomText" class="text-xs my-auto italic">
          {{ secondBottomText }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/User/UserAvatar.vue'
const props = defineProps<{
  user?: User
  secondText?: string
  firstBottomText?: string
  secondBottomText?: string
}>()
</script>
