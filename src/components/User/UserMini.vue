<template>
  <router-link class="flex mb-1.5 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 transition-colors duration-200" :to="user ? '/users/' + user.id : '/'">
    <UserAvatar class="my-auto" :user="user" />
    <div id="mycomponent" class="h-full flex flex-col w-full">
      <div v-if="user" id="mycomponent-2" class="flex w-auto my-auto shrink">
        <div v-if="user" class="sm:text-xs text-sm font-semibold ml-2 text-gray-800 dark:text-gray-200">
         {{ user.display_name }} 
        </div>
        <div v-else class="sm:text-xs text-sm italic ml-2 text-gray-600 dark:text-gray-400">Connectez vous pour voir l'auteur</div>
        <div v-if="secondText" class="mx-1 my-auto rounded-full bg-gray-800 dark:bg-gray-300 w-1 h-1"></div>
        <div v-if="secondText" class="text-2xs my-auto text-gray-600 dark:text-gray-400">{{ secondText }}</div>
      </div>
      <div v-if="firstBottomText" class="flex ml-2 grow shrink-0 overflow-auto">
        <div class="text-2xs my-auto italic text-gray-500 dark:text-gray-500">
          {{ firstBottomText }}
        </div>
        <div v-if="secondBottomText" class="mx-1 my-auto rounded-full bg-gray-800 dark:bg-gray-300 w-1 h-1"></div>
        <div v-if="secondBottomText" class="text-2xs my-auto italic text-gray-500 dark:text-gray-500">
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
