<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (commit 1.4) puis Dani (commit 1.5 — ajout des états + refacto store)
  Rôle     : Page principale de recherche des livres.
              Elle gère :
              - la saisie de recherche,
              - l'affichage des résultats,
              - les filtres,
              - les états de chargement et d'erreur,
              - la communication avec le store Pinia.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->

<template>
  <section class="flex flex-col gap-6">

    <!-- Titre de la page -->
    <h1 class="text-2xl font-bold">Recherche</h1>

    <!-- Barre de recherche liée à la variable searchInput -->
    <SearchBar
        v-model="searchInput"
        @submit="onSearch"
    />

    <!-- Affichage des filtres uniquement lorsqu'il y a des résultats -->
    <FilterBar
        v-if="store.results.length"
        :sort-by="store.sortBy"
        :min-year="store.minYear"
        @update:sort-by="store.sortBy = $event"
        @update:min-year="store.minYear = $event"
        @reset="resetFilters"
    />

    <!-- Informations sur le nombre de résultats affichés -->
    <p
        v-if="store.query && store.results.length && !store.error"
        class="text-sm text-gray-500"
    >
      <strong>{{ store.filteredResults.length }}</strong>
      résultat(s) affiché(s) sur
      <strong>{{ store.total.toLocaleString('fr-FR') }}</strong>
      pour « {{ store.query }} »
    </p>

    <!-- Affichage du spinner pendant le chargement initial -->
    <LoadingSpinner
        v-if="store.loading && !store.results.length"
        message="Recherche en cours..."
    />

    <!-- Affichage d'un message d'erreur avec possibilité de relancer la recherche -->
    <ErrorMessage
        v-else-if="store.error && !store.results.length"
        :message="store.error"
        :can-retry="true"
        @retry="store.search(store.query)"
    />

    <!-- Affichage lorsqu'aucun résultat n'est trouvé -->
    <EmptyState
        v-else-if="store.query && !store.loading && !store.results.length"
        icon="😕"
        title="Aucun résultat trouvé"
        :description="`Aucun livre ne correspond à « ${store.query} ».`"
    />

    <!-- État initial avant toute recherche -->
    <EmptyState
        v-else-if="!store.query"
        icon="🔍"
        title="Lancez une recherche"
        description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <!-- Affichage des résultats -->
    <template v-else>

      <!-- Liste des livres filtrés -->
      <BookList :books="store.filteredResults" />

      <!-- Bouton permettant de charger les pages suivantes -->
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

// Store Pinia contenant la logique métier de recherche
import { useBooksStore } from '@/stores/books.js'

// Composants utilisés dans la vue
import SearchBar from '@/components/SearchBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import BookList from '@/components/BookList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {

  // Nom du composant Vue
  name: 'SearchView',

  // Déclaration des composants enfants
  components: {
    SearchBar,
    FilterBar,
    BookList,
    LoadingSpinner,
    ErrorMessage,
    EmptyState
  },

  /**
   * Données locales du composant.
   * searchInput est initialisé à partir du paramètre q de l'URL.
   */
  data() {
    return {
      searchInput: this.$route.query.q?.toString() || ''
    }
  },

  computed: {

    /**
     * Fournit un accès simplifié au store Pinia.
     */
    store() {
      return useBooksStore()
    }
  },

  watch: {

    /**
     * Surveille les changements du paramètre q dans l'URL.
     * Permet de relancer automatiquement une recherche lorsque
     * l'utilisateur modifie l'URL ou utilise les boutons du navigateur.
     */
    '$route.query.q'(newQuery) {

      this.searchInput = newQuery?.toString() || ''

      if (newQuery) {
        this.store.search(newQuery.toString())
      }
    }
  },

  /**
   * Au chargement de la page :
   * si une recherche est déjà présente dans l'URL,
   * elle est automatiquement exécutée.
   */
  mounted() {

    const q = this.$route.query.q?.toString()

    if (q && q !== this.store.query) {
      this.store.search(q)
    }
  },

  methods: {

    /**
     * Déclenchée lors de la soumission du formulaire.
     * Met à jour l'URL avec le terme recherché.
     *
     * @param {string} term Terme recherché
     */
    onSearch(term) {
      this.$router.push({
        name: 'search',
        query: { q: term }
      })
    },

    /**
     * Réinitialise les filtres de tri et d'année.
     */
    resetFilters() {
      this.store.sortBy = 'relevance'
      this.store.minYear = ''
    }
  }
}
</script>