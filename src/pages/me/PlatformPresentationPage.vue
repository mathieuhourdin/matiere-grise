<template>
  <div class="w-10/12 md:w-9/12 mx-auto m-4">
    <div class="text-xl font-bold mb-5" v-if="user">Bonjour {{ user.first_name }}, et bienvenue sur Matière Grise !</div>
    <div class="my-2">
      De plus en plus de voix s’élèvent pour dire que l’IA va détruire tout ce que nous aimons dans le travail humain : la maîtrise technique, l’artisanat, la recherche de la connaissance.
Et, soyons honnêtes, cette peur est légitime. Personne ne sait vraiment où ces transformations vont nous mener.
    </div>
    <div class="my-2">
      Mais souvenez-vous : quand Steve Jobs a créé Apple, il faisait face à une peur très proche de la nôtre aujourd’hui : celle que les ordinateurs transforment le monde en quelque chose de froid, uniforme, désincarné.
Sa réponse a été de mettre les “liberal arts” au cœur de ses produits. C’est comme ça que la calligraphie s’est retrouvée dans le premier Macintosh : pour rappeler que la technologie peut porter du style, du goût, de la culture.
    </div>

    <iframe class="my-8 max-w-full md:max-w-9/12 mx-auto" width="560" height="315" src="https://www.youtube.com/embed/ErwS24cBZPc?si=U-iLA8XdajF-bxEl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

    <div class="my-2">
      Aujourd’hui, la menace s’est déplacée : ce n’est plus seulement le monde extérieur qui risque de s’uniformiser, c’est ce qui fait notre humanité même – notre manière de travailler, de créer, d’apprendre.
    </div>
    <div class="my-2">
      Donc nous devons faire la même chose que lui, mais à un autre niveau : faire appel à ce que nous avons de plus humain, à nos meilleures ressources – la culture, la littérature, la philosophie, les sciences humaines – pour que l’IA révèle le meilleur de nous, plutôt qu’elle ne l’efface.
    </div>

    <iframe class="my-8 max-w-full md:max-w-9/12 mx-auto" width="560" height="315" src="https://www.youtube.com/embed/YaKARJNQ9vA?si=d5-93FbRu3wnI4hA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

    <div class="my-2">
      C’est pour cela que nous avons créé Matière Grise.
    </div>
    <div class="my-2">
      À partir de vos traces de travail, de votre activité de journaling, Matière Grise enrichit votre regard sur votre propre pratique.
L’IA ne vous dit pas quoi faire. Elle lit vos rythmes, vos évolutions, mais aussi vos idéaux et les enjeux qui vous tiennent à cœur. Elle vous propose de nouvelles pistes de travail, des parcours de développement, et des enjeux contemporains où vous pouvez apporter votre touche. Elle vous renvoie des questions, des motifs, des histoires, inspirés par des millénaires de productions culturelles de l’humanité.
    </div>
    <div class="my-2">
      Et contrairement aux plateformes qui se multiplient pour structurer votre apprentissage avec l’IA, nous nous rappelons qu’apprendre peut être à la fois sérieux et joyeux. C’est pour cela que vous pourrez choisir d’être mentoré par les personnages de la culture qui vous inspirent, des figures de Yourcenar jusqu’à Gon et Kirua de Hunter x Hunter.
    </div>
    <div class="my-2">
      Nous voulons rendre gloire à cette capacité : la manière dont vous travaillez, dont vous développez votre propre style pour aborder les sujets qui comptent. Nous voulons qu’elle puisse s’exposer avec fierté, et qu’elle nourrisse ce que l’émulation entre pairs a de meilleur – car nous ne voulons pas communiquer uniquement avec des IA.
    </div>
    <div class="my-2">
      C’est pour cela que ce produit prend aussi la forme d’un réseau social : un lieu où vous pouvez exposer vos processus de travail, vos lectures, vos inspirations. Et où vous pouvez, en retour, vous nourrir des trajectoires de celles et ceux qui vous inspirent.
    </div>
    <div class="my-2">
      Êtes-vous prêt à choisir votre mission ? Si vous l'acceptez...
    </div>
    <div class="my-2">
      <ActionButton class="my-2" @click="goToMissionChoice" type="valid">Choisir une mission</ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useRouter } from 'vue-router'
const { user } = useUser()
const router = useRouter()
const goToMissionChoice = () => {
  router.push('/me/mission-choice')
}
</script>
