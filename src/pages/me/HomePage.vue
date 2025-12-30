<template>
  <div class="min-h-screen text-slate-100 p-2 md:p-10 md:w-11/12 mx-auto">
    <h1 class="text-2xl font-bold mb-4">Mon studio</h1>
    <div class="flex flex-col gap-4">
      <!-- Row 1: Achievements, Focus, Horizons -->
      <div class="flex gap-2 md:gap-8 overflow-x-auto pb-2">
        <!-- Achievements -->
        <HomeCard width="30%" height="36" :items="achievements">
          <template #header>
            <h2 class="flex items-center text-xs md:text-base font-bold">
              <span class="mr-2">👑</span>
              Achievements
            </h2>
          </template>
        </HomeCard>
        <!-- Focus -->
        <HomeCard width="30%" height="36" :items="focus">
          <template #header>
            <h2 class="flex items-center text-xs md:text-base font-bold">
              <span class="mr-2">🧑‍💻</span>
              Focus
            </h2>
          </template>
        </HomeCard>
        <!-- Horizons -->
        <HomeCard width="30%" height="36" :items="horizons">
          <template #header>
            <h2 class="flex items-center text-xs md:text-base font-bold">
              <span class="mr-2">🌍</span>
              Horizons
            </h2>
          </template>
        </HomeCard>
      </div>
      <!-- Row 2: Mentor image/message -->
      <MentorSection />
      <!-- Row 3: Journaling, Log Lecture, Log Production -->
      <JournalSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeCard from '@/components/Ui/HomeCard.vue'
import JournalSection from '@/components/Journal/JournalSection.vue'
import MentorSection from '@/components/Mentor/MentorSection.vue'
import { ref } from 'vue'

const achievements = ref([
  {
    title: "Envoyer cadrage mémoire",
    content: "Envoyer une première verision du mémoire avec une problématique claire et une recherche bibliographique approfondie."
  },
  {
    title: "Finir fiche High Output Management",
    content: "Fini d'analyser et de ficher le livre de Grove"
  },
  {
    title: "Terminer chapitre 4 DDIA",
    content: "Terminer le chapitre 4 de la partie sur la base de données distribuées"
  },
])
const focus = ref([
  {
    title: "Recherche bibliographique",
    content: "Rechercher des articles et des livres sur la problématique du mémoire"
  },
  {
    title: "Creuser cité industrielle",
    content: "Resituer les entreprises dans la cité industrielle"
  },
])
const horizons = ref([
  {
    title: "Trouver une thèse",
    content: "Faire un sujet suffisamment solide pour une thèse de doctorat"
  },
  {
    title: "Trouver un poste",
    content: "Trouver un poste dans une entreprise"
  },
])
</script>

<style scoped>
/* Hide scrollbars while maintaining scroll functionality */
.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar,
.overflow-auto::-webkit-scrollbar,
.overflow-scroll::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto,
.overflow-y-auto,
.overflow-auto,
.overflow-scroll {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>