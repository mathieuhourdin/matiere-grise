<template>
  <div class="mt-6 flex justify-center">
    <LoginForm v-if="!signin"
      ><div class="ml-auto flex items-center">
        <div class="text-xs underline p-2" @click="signin = true">Créer un compte</div>
      </div></LoginForm
    >
    <SignInForm v-else />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/App/LoginForm.vue'
import SignInForm from '@/components/App/SignInForm.vue'
import { ref } from 'vue'

const signin = ref(false)
</script>
