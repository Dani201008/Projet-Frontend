<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy
  Rôle     : Page des résultats de recherche.
  Créé le  : 08.05.2026
  Modifié  : 10.05.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <!-- Compteur affiché seulement quand on a au moins un résultat. -->
    <p v-if="query && results.length" class="text-sm text-gray-500">
      {{ results.length }} résultat(s) pour « {{ query }} »
    </p>

    <BookList v-if="results.length" :books="results" />
  </section>
</template>

<script>
import { searchBooks } from '@/services/openLibrary.js'
import SearchBar from '@/components/SearchBar.vue'
import BookList from '@/components/BookList.vue'

export default {
  name: 'SearchView',
  components: { SearchBar, BookList },

  data() {
    return {
      // L'input se pré-remplit avec ?q=... si l'URL en contient déjà un (ex. lien partagé).
      searchInput: this.$route.query.q?.toString() || '',
      query: '',
      results: []
    }
  },

  watch: {
    /**
     * Réagit au changement de `?q=` dans l'URL.
     * Déclenché quand l'utilisateur valide une nouvelle recherche
     * ou utilise les boutons Précédent / Suivant du navigateur.
     */
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.runSearch(newQuery.toString())
    }
  },

  /**
   * Au chargement de la page, si l'URL contient déjà un `?q=`,
   * on lance la recherche tout de suite (cas d'un lien direct).
   */
  mounted() {
    const q = this.$route.query.q?.toString()
    if (q) this.runSearch(q)
  },

  methods: {
    /**
     * Validation depuis la barre : on met à jour l'URL.
     * Le watcher ci-dessus déclenchera l'appel API.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },

    /**
     * Lance la recherche et transforme la réponse brute en objets simples
     * que les composants UI savent afficher.
     */
    async runSearch(term) {
      this.query = term
      const data = await searchBooks(term, { limit: 24, page: 1 })

      // L'API renvoie beaucoup de champs ; on ne garde que ceux dont on a besoin.
      // (data.docs || []) protège si la réponse n'a pas de docs (cas d'erreur).
      this.results = (data.docs || []).map(doc => ({
        id: (doc.key || '').replace('/works/', ''), // "/works/OL45W" → "OL45W"
        title: doc.title || 'Titre inconnu',
        authors: doc.author_name || [],
        year: doc.first_publish_year || null,
        coverId: doc.cover_i || null
      }))
    }
  }
}
</script>