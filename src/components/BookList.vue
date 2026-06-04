<!--
  Fichier  : src/components/BookList.vue
  Auteur   : Timmy
  Rôle     : Grille responsive de BookCard.
  Créé le  : 08.05.2026
  Modifié  : 10.05.2026
-->
<template>
  <!--
    Grille auto-fill : Tailwind calcule lui-même le nombre de colonnes
    selon la largeur de l'écran. Cartes de 140 px min sur mobile, 180 px sur desktop.
  -->
  <div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
    <!-- Une BookCard par livre. La key sert à Vue pour optimiser le rendu. -->
    <BookCard v-for="book in books" :key="book.id" :book="book" />
  </div>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'BookList',
  components: { BookCard },

  props: {
    // Tableau de livres { id, title, authors, year, coverId }.
    books: { type: Array, required: true }
  }
}
</script>