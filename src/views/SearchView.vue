<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (1.4), Dani (1.5 états, 3.1 store), Timmy (3.2 filtres), Dani (3.3 pagination), Samuel (4.x tri serveur + URL)
  Rôle     : Page des résultats. La requête, le tri et le filtre vivent dans l'URL (liens partageables).
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <FilterBar
      v-if="store.results.length || store.minYear || store.sort !== 'relevance'"
      :sort="store.sort"
      :min-year="store.minYear"
      @update:sort="onSort"
      @update:min-year="onMinYear"
      @reset="onReset"
    />

    <p v-if="store.query && store.results.length && !store.error" class="text-sm text-gray-500">
      <strong>{{ store.results.length }}</strong> résultat(s) affiché(s) sur <strong>{{ store.total.toLocaleString('fr-FR') }}</strong> pour « {{ store.query }} »
    </p>

    <!-- Squelettes pendant la première recherche (plus agréable qu'un simple spinner). -->
    <SkeletonGrid v-if="store.loading && !store.results.length" />

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

    <template v-else>
      <BookList :books="store.results" />
      <div v-if="store.hasMore" class="flex justify-center pt-4">
        <button
          type="button"
          class="border border-primary text-primary px-5 py-2.5 rounded-lg hover:bg-primary-light"
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
import SkeletonGrid from '@/components/SkeletonGrid.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'SearchView',
  components: { SearchBar, FilterBar, BookList, SkeletonGrid, ErrorMessage, EmptyState },
  data() {
    return {
      searchInput: this.$route.query.q?.toString() || ''
    }
  },
  computed: {
    store() {
      return useBooksStore()
    }
  },
  watch: {
    // L'URL est la source de vérité : tout changement (q, tri, filtre) relance la recherche.
    '$route.query'() {
      this.applyRouteQuery()
    }
  },
  mounted() {
    this.applyRouteQuery()
  },
  methods: {
    // Lit q / sort / minYear depuis l'URL, met le store à jour et lance la recherche.
    applyRouteQuery() {
      const q = this.$route.query.q?.toString() || ''
      this.searchInput = q
      this.store.sort = this.$route.query.sort?.toString() || 'relevance'
      this.store.minYear = this.$route.query.minYear?.toString() || ''
      if (q) {
        this.store.search(q)
      } else {
        this.store.reset()
      }
    },
    // Met l'URL à jour ; le watcher se charge de relancer la recherche.
    updateUrl(patch) {
      const query = { ...this.$route.query, ...patch }
      // On retire les valeurs vides ou par défaut pour garder une URL propre.
      Object.keys(query).forEach((key) => {
        if (!query[key] || query[key] === 'relevance') delete query[key]
      })
      this.$router.push({ name: 'search', query }).catch(() => {})
    },
    onSearch(term) {
      this.updateUrl({ q: term })
    },
    onSort(value) {
      this.updateUrl({ sort: value })
    },
    onMinYear(value) {
      this.updateUrl({ minYear: value })
    },
    onReset() {
      this.updateUrl({ sort: undefined, minYear: undefined })
    }
  }
}
</script>
