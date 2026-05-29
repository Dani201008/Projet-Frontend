<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (1.4), puis Dani (1.5 états, 3.1 passage au store Pinia)
  Rôle     : Page des résultats, branchée sur le store Pinia de recherche.
  Créé le  : 08.05.2026
  Modifié  : 29.05.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <p v-if="store.query && store.results.length && !store.error" class="text-sm text-gray-500">
      <strong>{{ store.results.length }}</strong> résultat(s) sur <strong>{{ store.total.toLocaleString('fr-FR') }}</strong> pour « {{ store.query }} »
    </p>

    <LoadingSpinner v-if="store.loading" message="Recherche en cours..." />

    <ErrorMessage
      v-else-if="store.error"
      :message="store.error"
      :can-retry="true"
      @retry="store.search(store.query)"
    />

    <EmptyState
      v-else-if="store.query && !store.results.length"
      icon="😕"
      title="Aucun résultat trouvé"
      :description="`Aucun livre ne correspond à « ${store.query} ».`"
    />

    <EmptyState
      v-else-if="!store.query"
      icon="🔍"
      title="Lancez une recherche"
      description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <BookList v-else :books="store.results" />
  </section>
</template>

<script>
import { useBooksStore } from '@/stores/books.js'
import SearchBar from '@/components/SearchBar.vue'
import BookList from '@/components/BookList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'SearchView',
  components: { SearchBar, BookList, LoadingSpinner, ErrorMessage, EmptyState },
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
    }
  }
}
</script>
