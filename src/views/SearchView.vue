<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (commit 1.4) puis Dani (commit 1.5, ajout des états)
  Rôle     : Page des résultats, avec les différents états (chargement, erreur, vide...).
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <!-- Compteur affiché uniquement quand on a des résultats. -->
    <p v-if="query && results.length && !error" class="text-sm text-gray-500">
      <strong>{{ results.length }}</strong> résultat(s) sur <strong>{{ total }}</strong> pour « {{ query }} »
    </p>

    <!--
      Les différents états possibles, dans l'ordre :
        1. loading → spinner
        2. error   → encart rouge avec bouton Réessayer
        3. query + 0 résultat → "Aucun résultat trouvé"
        4. pas encore de query → "Lancez une recherche"
        5. sinon → la grille de résultats
      L'ordre est important, Vue affiche le PREMIER cas vrai.
    -->
    <LoadingSpinner v-if="loading" message="Recherche en cours..." />

    <ErrorMessage
        v-else-if="error"
        :message="error"
        :can-retry="true"
        @retry="runSearch(query)"
    />

    <EmptyState
        v-else-if="query && !results.length"
        icon="😕"
        title="Aucun résultat trouvé"
        :description="`Aucun livre ne correspond à « ${query} ».`"
    />

    <EmptyState
        v-else-if="!query"
        icon="🔍"
        title="Lancez une recherche"
        description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <BookList v-else :books="results" />
  </section>
</template>

<script>
import { searchBooks } from '@/services/openLibrary.js'
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
      // On pré-remplit l'input avec le ?q=... de l'URL s'il y en a un.
      searchInput: this.$route.query.q?.toString() || '',
      query: '',
      results: [],
      total: 0,
      loading: false,
      error: null
    }
  },

  watch: {
    // Si le ?q= change dans l'URL (bouton précédent, lien direct...), on relance la recherche.
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.runSearch(newQuery.toString())
    }
  },

  // Au chargement, si l'URL contient déjà un ?q=, on lance la recherche tout de suite.
  mounted() {
    const q = this.$route.query.q?.toString()
    if (q) this.runSearch(q)
  },

  methods: {
    // On met à jour l'URL, le watcher au-dessus s'occupe de relancer la recherche.
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },

    // Appel API + tri des résultats + gestion des erreurs.
    async runSearch(term) {
      this.loading = true
      this.error = null
      this.query = term
      try {
        const data = await searchBooks(term, { limit: 24, page: 1 })

        // On ne garde que les champs qu'on utilise pour l'affichage.
        this.results = (data.docs || []).map(doc => ({
          id: (doc.key || '').replace('/works/', ''), // "/works/OL45W" → "OL45W"
          title: doc.title || 'Titre inconnu',
          authors: doc.author_name || [],
          year: doc.first_publish_year || null,
          coverId: doc.cover_i || null
        }))
        this.total = data.numFound || 0
      } catch (err) {
        console.error('Erreur recherche :', err)
        this.error = 'Impossible de récupérer les résultats. Vérifiez votre connexion.'
        this.results = []
      } finally {
        // On coupe le spinner dans tous les cas, sinon il tourne à l'infini.
        this.loading = false
      }
    }
  }
}
</script>
