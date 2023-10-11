<template>
  <div class="border shadow-lg rounded p-4">
    <router-link :to="'/users/' + user.id">
      <div class="px-20">
        <img
          :src="image_src"
          class="border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/2] object-cover object-center w-full"
        />
      </div>
      <div class="text-center mt-4">{{ user.first_name }} {{ user.last_name }}</div>
      <div class="text-center mt-4">{{ user.handle }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { type User } from '@/types/models'
import { ref } from 'vue'
const props = defineProps<{
  user: User
}>()

const image_src = ref(
  'https://media.licdn.com/dms/image/D4E03AQGRZ_CSCPLOIQ/profile-displayphoto-shrink_800_800/0/1683193168898?e=2147483647&v=beta&t=BDVbedpdVD1FxKeTYvs44DxHiC0ecpQRFXAnU5ist4w'
)
</script>
