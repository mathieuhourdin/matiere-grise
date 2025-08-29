<template>
  <div class="md:m-20 m-4">
    <div class="text-xl font-bold mb-5" v-if="user">Bonjour {{ user.first_name }},</div>
    <div class="text-xl font-bold mb-5 text-center">Bienvenue sur Matière Grise !</div>
    <div class="my-2">
      Cette plateforme permet de montrer à ses amis des oeuvres qu'on lit, regarde, écoute, ainsi
      que des textes qu'on écrit soi même. Elle permet de mettre en relation ces contenus : dire ce
      qu'on en a pensé, faire des fiches de lecture, ou les organiser autour de problématiques.
    </div>
    <div class="my-2">
      Inspiré d'Instagram, Matière grise s'organise autour d'un fil d'actualité. Les articles
      peuvent être ouverts en cliquant sur le titre, ou être lus sans quitter le fil en cliquant sur
      l'image, pour faire défiler le texte en format slides.
    </div>

    <div class="my-2">
      Les articles que vous produisez sont par défaut au stade brouillon, et doivent être passé en
      terminé pour être accessibles.
    </div>
    <div class="my-2">
      Il n'est pas possible de stocker des images sur la plateforme. Pour associer une image à un
      article, vous devez indiquer l'url d'une image disponible sur internet, par exemple en la
      cherchant sur google images.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
const { user } = useUser()
</script>
