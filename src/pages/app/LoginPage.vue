<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
    <div class="mx-auto max-w-xl pt-4 md:pt-10">
      <h1 class="text-3xl font-bold tracking-tight">Bienvenue</h1>
      <p class="mt-2 text-sm text-slate-400">
        Connecte-toi pour accéder à ton studio et reprendre ton travail.
      </p>

      <div class="mt-6 inline-flex rounded-xl border border-slate-700 bg-slate-900/70 p-1">
        <button
          type="button"
          class="px-4 py-2 text-sm rounded-lg transition-colors"
          :class="!signin ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'"
          @click="signin = false"
        >
          Connexion
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm rounded-lg transition-colors"
          :class="signin ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'"
          @click="signin = true"
        >
          Inscription
        </button>
      </div>

      <div class="mt-4">
        <LoginForm v-if="!signin" />
        <SignInForm v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/App/LoginForm.vue'
import SignInForm from '@/components/App/SignInForm.vue'
import { ref } from 'vue'

const signin = ref(false)
</script>
