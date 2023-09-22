<template>
  <div class="m-20">
    <div class="text-xl font-bold mb-5" v-if="user">Bonjour {{ user.first_name }},</div>
    <div class="text-xl font-bold mb-5">Bienvenue sur la plateforme !</div>
    <div class="my-2">
      Le but de la plateforme est de permettre de construire et de suivre des processus
      intellectuels. Un processus intellectuel se matérialise par des inputs (les livres, les
      articles qu'on lit, les films qu'on va voir au cinéma...) et les outputs (des articles qu'on
      écrit, les musiques qu'on produit...). Actuellement on peut seulement écrire et commenter des
      articles.
    </div>
    <div class="my-2">
      L'écriture des articles est rendue la plus collaborative possible. On peut notamment ajouter
      des commentaires dans le texte des articles déjà écrits ou en cours d'écriture (click droit
      sur l'endroit où on veut commenter). Chaque article est lié à un auteur qui est le seul à
      pouvoir faire des modifications dans l'article. Les autres peuvent simplement commenter.
    </div>
    <div class="my-2">
      Une fois l'article publié, on le modifie à l'aide d'un éditeur de texte propre à la
      plateforme. Cet éditeur de texte s'améliore constamment, mais il souffre encore de quelques
      manques par rapport aux editeurs de textes classiques (impossible de copier coller avec
      certains navigateurs, fleches verticales ne permettent pas de se déplacer...).
    </div>
    <div class="my-2">
      Il permet une mise en page simple, inspirée du langage markdown. Pour mettre un paragraphe ou
      une ligne en gras, il faut commencer la ligne par un "#". Pour créer une liste à puce, il faut
      commencer le paragraphe par un "*".
    </div>
    <div class="mt-5">
      Les articles sont classés par trois stades de maturation :
      <ul class="list-disc list-inside">
        <li><strong>Idée</strong> : non formalisé, peut être repris par quelqu'un d'autre</li>
        <li>
          <strong>Relecture</strong> : bien avancé, mais peut bénéficier de l'aide d'un autre
          utilisateur
        </li>
        <li>
          <strong>Terminé</strong> : état satisfaisant, peut ête lu de façon agréable par n'importe
          qui
        </li>
      </ul>
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
