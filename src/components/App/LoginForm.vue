<template>
  <div class="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm md:p-7">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-100">Connexion</h2>
      <p class="mt-2 text-sm text-slate-300">Entre ton email et ton mot de passe.</p>
    </div>

    <div class="space-y-5">
      <div class="flex flex-col gap-2">
        <label for="login-username" class="text-sm font-medium text-slate-200">Email</label>
        <input
          id="login-username"
          v-model="username"
          type="email"
          autocomplete="username"
          class="form-input"
          placeholder="vous@email.com"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="login-password" class="text-sm font-medium text-slate-200">Mot de passe</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="form-input"
          placeholder="Votre mot de passe"
        />
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200 whitespace-pre-wrap break-words"
    >
      <div class="font-semibold mb-1">Connexion impossible</div>
      <div>{{ errorMessage }}</div>
    </div>

    <div class="mt-6 flex gap-3">
      <button
        type="button"
        class="flex-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
        :disabled="isSubmitting"
        @click="resetForm"
      >
        Annuler
      </button>
      <button
        type="button"
        class="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        :disabled="isSubmitting || !username.trim() || !password.trim()"
        @click="submit"
      >
        {{ isSubmitting ? 'Connexion...' : 'Valider' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { useRoute } from 'vue-router'

const route = useRoute()
const { authUser } = useUser()
const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const normalizedRedirectPath = (): string => {
  const raw = Array.isArray(route.query.redirectPath) ? route.query.redirectPath[0] : route.query.redirectPath
  if (typeof raw === 'string' && raw.trim().length > 0) return raw
  return '/'
}

const resetForm = () => {
  username.value = ''
  password.value = ''
  errorMessage.value = ''
}

const submit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await authUser(
      { username: username.value, password: password.value },
      normalizedRedirectPath()
    )
  } catch (error: any) {
    if (typeof error === 'string' && error.trim().length > 0) {
      errorMessage.value = error
    } else if (error && typeof error === 'object') {
      try {
        errorMessage.value = JSON.stringify(error, null, 2)
      } catch (_jsonError) {
        errorMessage.value = String(error)
      }
    } else {
      errorMessage.value = 'Erreur lors de la connexion'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgb(71 85 105 / 1);
  background: rgb(2 6 23 / 0.9);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(241 245 249 / 1);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.form-input::placeholder {
  color: rgb(100 116 139 / 1);
}

.form-input:focus {
  outline: none;
  border-color: rgb(56 189 248 / 1);
  box-shadow: 0 0 0 2px rgb(14 165 233 / 0.35);
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: rgb(241 245 249 / 1);
  -webkit-box-shadow: 0 0 0 1000px rgb(2 6 23 / 0.9) inset;
  caret-color: rgb(241 245 249 / 1);
  transition: background-color 9999s ease-in-out 0s;
}
</style>
