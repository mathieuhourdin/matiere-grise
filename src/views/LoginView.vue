<template>
  <div class="mt-10 flex items-center justify-center">
    <LoginForm v-if="!signin"
      ><div class="ml-auto flex items-center">
        <div class="text-xs underline p-2" @click="signin = true">Créer un compte</div>
      </div></LoginForm
    >
    <SignInForm v-else />
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'
import SignInForm from '@/components/SignInForm.vue'
import { ref } from 'vue'

const signin = ref(false)
</script>
