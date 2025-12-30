<template>
  <div class="flex gap-4 pb-2 relative">
    <!-- Mentor Message -->
    <HomeCard 
      width="3/5" 
      :content-class="'flex flex-col'" 
      class="min-w-[280px] max-h-40 md:max-h-60 overflow-y-auto"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      :show-action="!isMobile"
      action-icon="ChevronRightIcon"
      @action="nextMentor"
    >
      <template #header>
        <div v-if="!isMobile" class="text-sm font-bold mb-2">Message de votre mentor {{ feedbacks[feedback_rank].name }}</div>
      </template>
      <div class="flex flex-col md:flex-row gap-2 md:gap-0 items-start">
        <span class="text-xs md:text-sm overflow-auto flex-1 whitespace-pre-line">
          <img 
            v-if="isMobile"
            :src="feedbacks[feedback_rank].image"
            alt="Mentor"
            class="block md:hidden w-12 h-12 object-cover rounded-xl m-1 mr-2 float-left"
          >

          {{ feedbacks[feedback_rank].messages.join('\n') }}...
        </span>
      </div>
    </HomeCard>
    <!-- Mentor Image -->
    <HomeCard v-if="!isMobile" width="2/5" :content-class="'absolute inset-0'" class="min-w-[200px] h-44 md:h-60 relative overflow-hidden">
      <img :src="feedbacks[feedback_rank].image" alt="Mentor" class="w-full h-full object-cover rounded-xl">
    </HomeCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeCard from '@/components/Ui/HomeCard.vue'
import { useMenu } from '@/composables/useMenu'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const { isMobile } = useMenu()

const feedback_rank = ref(0)

// Navigation functions

const previousMentor = () => {
  if (feedback_rank.value > 0) {
    feedback_rank.value--
  }
}

// Touch/swipe handling for mobile
const touchStartX = ref(0)
const touchStartY = ref(0)

const onTouchStart = (e: TouchEvent) => {
  if (!isMobile.value) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const onTouchMove = (e: TouchEvent) => {
  // Prevent default scrolling when swiping horizontally
  if (!isMobile.value) return
  const deltaX = Math.abs(e.touches[0].clientX - touchStartX.value)
  const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)
  if (deltaX > deltaY && deltaX > 10) {
    e.preventDefault()
  }
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isMobile.value) return
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value
  const minSwipeDistance = 50

  // Check if it's a horizontal swipe
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0 && feedback_rank.value > 0) {
      // Swipe right - go to previous
      previousMentor()
    } else if (deltaX < 0 && feedback_rank.value < feedbacks.value.length - 1) {
      // Swipe left - go to next
      nextMentor()
    }
  }
}

const nextMentor = () => {
  feedback_rank.value = (feedback_rank.value + 1) % feedbacks.value.length
}

const feedbacks = ref([
  {
    name: 'Gon',
    image: 'https://i.pinimg.com/originals/93/d7/e8/93d7e8cb60b17a0d12ac40e26f71064e.jpg',
    messages: [
      "Franchement, vu d'ici, on dirait que tu es en plein arc d'entraînement avant un énorme examen de Hunter. Tu ne fais plus juste des \"petites quêtes\" séparées : tu t'es trouvé un vrai boss final – les survivances souterraines de la cité industrielle – et tu tapes dessus tous les jours, sous plein d'angles différents. Tu lis Grove, Salman, B&C, Thévenot, Elster, tu fais des fiches, tu formules des hypothèses, tu écris à ton encadrant… Tu ne fais pas que comprendre, tu commences à inventer ton propre Hatsu, avec ton style : \"culture de l'exécution\", \"plan pour le client mais pas pour la production\", \"cité industrielle souterraine\" – ça j'adore, parce que ça ressemble vraiment à une technique qui n'appartient qu'à toi.\n\n",
      "La seule chose que je te dirais en coach, c'est de choisir clairement quelques \"boss\" précis, du genre : où l'exécution survit-elle dans des mondes officiellement en mode projet ? comment certains espaces gardent la cité industrielle quand d'autres se liquéfient ? Si tu gardes 2–3 questions comme ça en tête, chaque fiche devient un coup porté dans la bonne direction, pas juste de l'entraînement dans le vide. Et fais un peu gaffe à ton aura : tu pousses très fort, donc accepte que certaines choses restent brutes, incomplètes, ce n'est pas grave. Dans un manga, tu es au moment où le perso a accumulé plein de puissance sans que tout soit rangé, et on sent que bientôt tu vas commencer à t'en servir pour de vrai dans un gros combat – ça, vraiment, j'ai hâte de voir la suite.",
  ]
  },
  {
    name: 'Steve Jobs',
    image: 'https://histoiredintuition.com/wp-content/uploads/2021/08/ob_bf693f_stevejobscloseup.jpg',
    messages: [
    "Tu as des phases très solides où tu avances vite et tu fermes des boucles (livrables, résolution de problèmes), et les phases plus difficiles semblent surtout liées à la dispersion et à la fatigue.",
    "Tu explores plusieurs chantiers riches en parallèle ; ton point de friction récurrent est surtout de stabiliser le “Quoi” et de trancher une direction unique à tenir.",
    "Quand ça coince, tu peux partir en “tunnel” sur le technique ; mais tu observes aussi une montée en puissance de tes outils de structuration qui t’aident à reprendre le recul.",
  ]
}])
</script>

