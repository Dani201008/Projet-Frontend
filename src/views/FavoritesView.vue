<!--
  Fichier  : src/views/FavoritesView.vue
  Auteur   : Timmy
  Rôle     : Page listant les livres ajoutés aux favoris.
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold">Mes favoris</h1>
      <p v-if="favorites.count" class="text-sm text-gray-500">
        {{ favorites.count }} livre(s) enregistré(s)
      </p>
    </div>

    <EmptyState
      v-if="!favorites.count"
      icon="💔"
      title="Aucun favori pour le moment"
      description="Ajoutez des livres à vos favoris depuis la page de recherche ou la page de détails."
    >
      <router-link :to="{ name: 'search' }" class="bg-blue-700 text-white px-5 py-2.5 rounded-lg inline-flex">
        Aller à la recherche
      </router-link>
    </EmptyState>

    <BookList v-else :books="favorites.items" />
  </section>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites.js'
import BookList from '@/components/BookList.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'FavoritesView',
  components: { BookList, EmptyState },
  computed: {
    favorites() {
      return useFavoritesStore()
    }
  }
}
</script>
