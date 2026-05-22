<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (commit 1.4) puis Dani (commit 1.5 — ajout des états)
  Rôle     : Page des résultats avec gestion explicite des états.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <!-- Compteur affiché seulement quand on a vraiment des résultats à montrer. -->
    <p v-if="query && results.length && !error" class="text-sm text-gray-500">
      <strong>{{ results.length }}</strong> résultat(s) sur <strong>{{ total }}</strong> pour « {{ query }} »
    </p>

    <!--
      Machine à états visuels.
      L'ordre des v-if / v-else-if est important : Vue affiche le PREMIER vrai.
      Cas, dans l'ordre :
        1. loading           → spinner
        2. error             → encart rouge avec bouton Réessayer
        3. query mais 0 résultat → "Aucun résultat trouvé"
        4. pas encore de query   → "Lancez une recherche"
        5. sinon                 → la grille de résultats
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
      // Pré-remplit l'input avec ?q=... si présent dans l'URL.
      searchInput: this.$route.query.q?.toString() || '',
      query: '',
      results: [],
      total: 0,
      loading: false,
      error: null
    }
  },

  watch: {
    /**
     * Réagit aux changements de `?q=` dans l'URL (validation, suggestion, bouton précédent…).
     */
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.runSearch(newQuery.toString())
    }
  },

  /**
   * Au chargement de la page, si l'URL contient déjà un `?q=`,
   * on déclenche la recherche immédiatement (cas d'un lien direct).
   */
  mounted() {
    const q = this.$route.query.q?.toString()
    if (q) this.runSearch(q)
  },

  methods: {
    /**
     * Met à jour l'URL ; le watcher ci-dessus se charge de relancer la recherche.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },

    /**
     * Appel API + transformation des résultats + gestion des erreurs.
     *
     * Le pattern try / catch / finally :
     *   - try    : on tente l'appel
     *   - catch  : on intercepte les erreurs réseau ou serveur
     *   - finally: on coupe le spinner DANS TOUS LES CAS (succès ou échec)
     */
    async runSearch(term) {
      this.loading = true
      this.error = null
      this.query = term
      try {
        const data = await searchBooks(term, { limit: 24, page: 1 })

        // L'API renvoie beaucoup de champs ; on ne garde que ceux qu'on affiche.
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
        // Toujours couper le spinner, même en cas d'erreur, sinon il tourne à l'infini.
        this.loading = false
      }
    }
  }
}
</script>
