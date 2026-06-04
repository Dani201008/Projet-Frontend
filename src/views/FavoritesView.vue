<template>
  <section class="flex flex-col gap-6">

    <!-- Titre + compteur de favoris -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold">Mes favoris</h1>

      <!-- Affiche le nombre de livres favoris si au moins un existe -->
      <p v-if="favorites.count" class="text-sm text-gray-500">
        {{ favorites.count }} livre(s) enregistré(s)
      </p>
    </div>

    <!-- État vide : aucun favori -->
    <EmptyState
        v-if="!favorites.count"
        icon="💔"
        title="Aucun favori pour le moment"
        description="Ajoutez des livres à vos favoris depuis la page de recherche ou la page de détails."
    >

      <!-- Bouton pour rediriger vers la recherche -->
      <router-link
          :to="{ name: 'search' }"
          class="bg-blue-700 text-white px-5 py-2.5 rounded-lg inline-flex"
      >
        Aller à la recherche
      </router-link>

    </EmptyState>

    <!-- Liste des favoris si elle existe -->
    <BookList v-else :books="favorites.items" />

  </section>
</template>

<script>

// Store Pinia des favoris
import { useFavoritesStore } from '@/stores/favorites.js'

// Composants UI
import BookList from '@/components/BookList.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {

  name: 'FavoritesView',

  components: {
    BookList,
    EmptyState
  },

  computed: {

    /**
     * Accès au store des favoris
     */
    favorites() {
      return useFavoritesStore()
    }
  }
}
</script>