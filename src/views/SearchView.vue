<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (1.4), Dani (1.5 états, 3.1 store), Timmy (3.2 filtres), Dani (3.3 pagination)
  Rôle     : Page des résultats, branchée sur le store Pinia de recherche.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <FilterBar
      v-if="store.results.length"
      :sort-by="store.sortBy"
      :min-year="store.minYear"
      @update:sort-by="store.sortBy = $event"
      @update:min-year="store.minYear = $event"
      @reset="resetFilters"
    />

    <p v-if="store.query && store.results.length && !store.error" class="text-sm text-gray-500">
      <strong>{{ store.filteredResults.length }}</strong> résultat(s) affiché(s) sur <strong>{{ store.total.toLocaleString('fr-FR') }}</strong> pour « {{ store.query }} »
    </p>

    <!-- Spinner plein écran seulement à la première recherche (pas pendant un « Charger plus »). -->
    <LoadingSpinner v-if="store.loading && !store.results.length" message="Recherche en cours..." />

    <ErrorMessage
      v-else-if="store.error && !store.results.length"
      :message="store.error"
      :can-retry="true"
      @retry="store.search(store.query)"
    />

    <EmptyState
      v-else-if="store.query && !store.loading && !store.results.length"
      icon="search-x"
      title="Aucun résultat trouvé"
      :description="`Aucun livre ne correspond à « ${store.query} ».`"
    />

    <EmptyState
      v-else-if="!store.query"
      icon="search"
      title="Lancez une recherche"
      description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <!-- Cas normal : la grille + le bouton de pagination s'il reste des résultats à charger. -->
    <template v-else>
      <BookList :books="store.filteredResults" />
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
  components: { SearchBar, FilterBar, BookList, LoadingSpinner, ErrorMessage, EmptyState },
  data() {
    return {
      searchInput: this.$route.query.q?.toString() || ''
    }
  },
  computed: {
    // Le store partagé : tout l'état de recherche y vit désormais.
    store() {
      return useBooksStore()
    }
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.store.search(newQuery.toString())
    }
  },
  mounted() {
    const q = this.$route.query.q?.toString()
    // Évite de relancer la recherche si le store a déjà ces résultats (retour arrière).
    if (q && q !== this.store.query) this.store.search(q)
  },
  methods: {
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },
    // Remet le tri et le filtre à leur valeur par défaut.
    resetFilters() {
      this.store.sortBy = 'relevance'
      this.store.minYear = ''
    }
  }
}
</script>
