<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (commit 1.4) puis Dani (commit 1.5 — ajout des états + refacto store)
  Rôle     : Page de recherche des livres. Gère l’affichage, les filtres et l’interaction avec le store Pinia.
  Créé le  : 08.05.2026
  Modifié  : 29.05.2026
-->

<template>
  <section class="flex flex-col gap-6">

    <!-- Titre de la page -->
    <h1 class="text-2xl font-bold">Recherche</h1>

    <!-- Barre de recherche (input lié en v-model) -->
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <!-- Filtres affichés uniquement si des résultats existent -->
    <FilterBar
        v-if="store.results.length"
        :sort-by="store.sortBy"
        :min-year="store.minYear"
        @update:sort-by="store.sortBy = $event"
        @update:min-year="store.minYear = $event"
        @reset="resetFilters"
    />

    <!-- Compteur de résultats -->
    <p
        v-if="store.query && store.results.length && !store.error"
        class="text-sm text-gray-500"
    >
      <strong>{{ store.filteredResults.length }}</strong> résultat(s) affiché(s) sur
      <strong>{{ store.total.toLocaleString('fr-FR') }}</strong>
      pour « {{ store.query }} »
    </p>

    <!-- État : chargement initial -->
    <LoadingSpinner
        v-if="store.loading && !store.results.length"
        message="Recherche en cours..."
    />

    <!-- État : erreur -->
    <ErrorMessage
        v-else-if="store.error && !store.results.length"
        :message="store.error"
        :can-retry="true"
        @retry="store.search(store.query)"
    />

    <!-- État : aucun résultat -->
    <EmptyState
        v-else-if="store.query && !store.loading && !store.results.length"
        icon="😕"
        title="Aucun résultat trouvé"
        :description="`Aucun livre ne correspond à « ${store.query} ».`"
    />

    <!-- État : page vide (aucune recherche lancée) -->
    <EmptyState
        v-else-if="!store.query"
        icon="🔍"
        title="Lancez une recherche"
        description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <!-- Résultats -->
    <template v-else>

      <!-- Liste des livres filtrés et triés -->
      <BookList :books="store.filteredResults" />

      <!-- Bouton "charger plus" si pagination disponible -->
      <div v-if="store.hasMore" class="flex justify-center pt-4">
        <button
            type="button"
            class="border border-blue-700 text-blue-700 px-5 py-2.5 rounded-lg"
            :disabled="store.loadingMore"
            @click="store.loadMore()"
        >
          {{ store.loadingMore ? 'Chargement...' : 'Charger plus de résultats' }}
        </button>
      </div>

    </template>

  </section>
</template>

<script>
import { useBooksStore } from '@/stores/books.js'
import SearchBar from '@/components/SearchBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import BookList from '@/components/BookList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'SearchView',

  components: {
    SearchBar,
    FilterBar,
    BookList,
    LoadingSpinner,
    ErrorMessage,
    EmptyState
  },

  data() {
    return {
      /**
       * Valeur locale de la barre de recherche.
       * Synchronisée avec l’URL (?q=...).
       */
      searchInput: this.$route.query.q?.toString() || ''
    }
  },

  computed: {
    /**
     * Accès au store Pinia des livres.
     * Centralise toute la logique métier.
     */
    store() {
      return useBooksStore()
    }
  },

  watch: {
    /**
     * Synchronisation avec l’URL.
     * Permet :
     * - navigation navigateur (retour / suivant)
     * - partage de lien
     * - modification directe de l’URL
     */
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.store.search(newQuery.toString())
    }
  },

  mounted() {
    /**
     * Lance automatiquement une recherche
     * si un paramètre ?q= est présent au chargement.
     */
    const q = this.$route.query.q?.toString()
    if (q && q !== this.store.query) {
      this.store.search(q)
    }
  },

  methods: {

    /**
     * Déclenche une recherche via le routeur.
     * L’URL devient la source de vérité.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },

    /**
     * Réinitialise uniquement les filtres
     * sans toucher aux résultats.
     */
    resetFilters() {
      this.store.sortBy = 'relevance'
      this.store.minYear = ''
    }
  }
}
</script>