<template>
  <div class="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm md:p-7">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-100">Inscription</h2>
      <p class="mt-2 text-sm text-slate-300">Crée ton compte pour démarrer.</p>
      <p class="mt-3 text-xs font-medium text-slate-400">Étape {{ currentStep }} / 2</p>
      <div class="mt-2 h-1.5 w-full rounded-full bg-slate-800">
        <div
          class="h-full rounded-full bg-sky-500 transition-all duration-200"
          :style="{ width: currentStep === 1 ? '50%' : '100%' }"
        />
      </div>
    </div>

    <div v-if="currentStep === 1" class="space-y-5">
      <div class="flex flex-col gap-2">
        <label for="signin-email" class="text-sm font-medium text-slate-200">Email*</label>
        <input
          id="signin-email"
          v-model="newUser.email"
          type="email"
          autocomplete="email"
          placeholder="vous@email.com"
          class="form-input"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="signin-password" class="text-sm font-medium text-slate-200">Mot de passe*</label>
        <input
          id="signin-password"
          v-model="newUser.password"
          type="password"
          autocomplete="new-password"
          placeholder="Mot de passe"
          class="form-input"
        />
      </div>
    </div>

    <div v-else class="space-y-5">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="signin-first-name" class="text-sm font-medium text-slate-200">Prénom</label>
          <input
            id="signin-first-name"
            v-model="newUser.first_name"
            type="text"
            autocomplete="given-name"
            placeholder="Prénom"
            class="form-input"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="signin-last-name" class="text-sm font-medium text-slate-200">Nom</label>
          <input
            id="signin-last-name"
            v-model="newUser.last_name"
            type="text"
            autocomplete="family-name"
            placeholder="Nom"
            class="form-input"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="signin-photo" class="text-sm font-medium text-slate-200">Photo de profil (URL)</label>
        <input
          id="signin-photo"
          v-model="newUser.profile_picture_url"
          type="url"
          autocomplete="url"
          placeholder="https://..."
          class="form-input"
        />
      </div>

      <img
        v-if="newUser.profile_picture_url !== ''"
        class="rounded-lg max-h-36 object-cover border border-slate-700 mt-1"
        :src="newUser.profile_picture_url"
      />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="signin-pseudo" class="text-sm font-medium text-slate-200">Pseudo</label>
          <input
            id="signin-pseudo"
            v-model="newUser.pseudonym"
            type="text"
            placeholder="Votre pseudo"
            class="form-input"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="signin-handle" class="text-sm font-medium text-slate-200">Handle* (@...)</label>
          <input
            id="signin-handle"
            v-model="newUser.handle"
            type="text"
            placeholder="@votre_handle"
            class="form-input"
          />
          <p class="text-xs text-slate-400">Ce handle sera visible publiquement.</p>
        </div>
      </div>

      <label class="inline-flex items-center gap-2 text-sm text-slate-200">
        <input
          v-model="newUser.pseudonymized"
          type="checkbox"
          class="rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
        />
        Ne montrer que votre pseudo
      </label>
    </div>

    <div
      v-if="errorMessage"
      class="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200 whitespace-pre-wrap break-words"
    >
      <div class="font-semibold mb-1">Inscription impossible</div>
      <div>{{ errorMessage }}</div>
    </div>

    <div class="mt-6 flex gap-3">
      <button
        type="button"
        class="flex-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
        :disabled="isSubmitting"
        @click="handleSecondaryAction"
      >
        {{ currentStep === 1 ? 'Annuler' : 'Précédent' }}
      </button>
      <button
        type="button"
        class="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        :disabled="isPrimaryActionDisabled"
        @click="handlePrimaryAction"
      >
        {{ currentStep === 1 ? 'Continuer' : isSubmitting ? 'Création...' : 'Valider' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUser } from '@/composables/useUser'

const { createNewUser } = useUser()
const errorMessage = ref('')
const isSubmitting = ref(false)
const currentStep = ref<1 | 2>(1)

const newUser = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  profile_picture_url: '',
  handle: '@',
  password: '',
  pseudonym: '',
  pseudonymized: false
})

watch(
  () => [newUser.value.first_name, newUser.value.last_name],
  ([firstName, lastName]) => {
    if (firstName || lastName) {
      const firstPart = firstName ? firstName.toLowerCase().replace(/\s+/g, '_') : ''
      const lastPart = lastName ? lastName.toLowerCase().replace(/\s+/g, '_') : ''
      if (firstPart && lastPart) {
        newUser.value.handle = '@' + firstPart + '_' + lastPart
      } else if (firstPart) {
        newUser.value.handle = '@' + firstPart
      } else if (lastPart) {
        newUser.value.handle = '@' + lastPart
      } else {
        newUser.value.handle = '@'
      }
    } else {
      newUser.value.handle = '@'
    }
  },
  { immediate: true }
)

const resetForm = () => {
  newUser.value = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile_picture_url: '',
    handle: '@',
    password: '',
    pseudonym: '',
    pseudonymized: false
  }
  currentStep.value = 1
  errorMessage.value = ''
}

const goToStepTwo = () => {
  if (!newUser.value.email.trim() || !newUser.value.password.trim()) return
  errorMessage.value = ''
  currentStep.value = 2
}

const backToStepOne = () => {
  currentStep.value = 1
  errorMessage.value = ''
}

const isPrimaryActionDisabled = computed(() => {
  if (isSubmitting.value) return true
  if (currentStep.value === 1) {
    return !newUser.value.email.trim() || !newUser.value.password.trim()
  }
  return !newUser.value.email.trim() || !newUser.value.password.trim() || !newUser.value.handle.trim()
})

const handlePrimaryAction = async () => {
  if (currentStep.value === 1) {
    goToStepTwo()
    return
  }
  await submit()
}

const handleSecondaryAction = () => {
  if (currentStep.value === 1) {
    resetForm()
    return
  }
  backToStepOne()
}

const submit = async () => {
  if (isSubmitting.value) return
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await createNewUser(newUser.value as any)
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
      errorMessage.value = String(error ?? 'Erreur lors de la création du compte')
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
