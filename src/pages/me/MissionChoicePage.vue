<!--<template>
  <div class="py-12 w-11/12 mx-auto">
    <h1 class="text-xl">Choisissez une mission</h1>
    <span class="text-sm text-gray-400 italic">The people who are crazy enough to think they can change the world are the ones that do.</span>
    <ListComponent class="w-full mt-6" :items="missions" :columns="columns" :display-header="false" />
    <ActionButton @click="next" type="valid" class="m-2">Valider</ActionButton>
  </div>
</template>-->
<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-4">
    <div class="mx-auto max-w-6xl">
      <!-- Wrapper responsive -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Colonne gauche : items à choisir -->
        <section
          class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <h2 class="mb-3 text-sm font-semibold text-slate-200">
            À choisir
          </h2>
          <ListComponent class="w-full mt-6" :items="missions" :columns="columns" :display-header="false" />

        </section>

        <!-- Colonne droite : items choisis -->
        <section
          class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <h2 class="mb-3 text-sm font-semibold text-slate-200">
            Déjà choisis
          </h2>

          <!-- Ta sélection ici -->
          <ul class="space-y-2 text-sm">
            <li class="flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2">
              <span>Item sélectionné</span>
              <button class="text-xs text-slate-400 hover:text-red-400">
                Retirer
              </button>
            </li>
          </ul>
          <ActionButton @click="next" type="valid" class="m-2 mb-6 w-24 ml-auto">Valider</ActionButton>
        </section>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListComponent from '@/components/Ui/ListComponent.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useResource } from '@/composables/useResource'
import { type ApiResource } from '@/types/models'
import { useRouter } from 'vue-router'
const router = useRouter()

const { getResources } = useResource()

const missions = ref<ApiResource[]>([])

const columns = ref<{ display_name: string, field_name: string[], field_type: string }[]>([
  { display_name: 'Image', field_name: ['image_url'], field_type: 'image' },
  { display_name: 'Titre', field_name: ['title', 'subtitle'], field_type: 'text' },
  { display_name: 'Action', field_name: ['action'], field_type: 'action' }
])

const next = () => {
  router.push('/me/mentor-choice')
}

onMounted(async () => {
  missions.value = await getResources({ resource_type: 'miss' })
})
</script>