<!--
  Fichier  : src/views/HomeView.vue
  Auteur   : Timmy
  Rôle     : Page d'accueil avec barre de recherche.
  Créé le  : 08.05.2026
  Modifié  : 09.05.2026
-->
<template>
  <section class="flex flex-col gap-8">
    <!-- Bandeau bleu d'accueil avec la barre de recherche au centre. -->
    <div class="text-center py-10 bg-blue-700 text-white rounded-xl">
      <h1 class="text-3xl font-bold mb-4">Découvrez des millions de livres</h1>
      <p class="mb-6">Recherchez parmi la base d'OpenLibrary.</p>
      <SearchBar v-model="query" @submit="onSearch" />
    </div>
  </section>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'HomeView',
  components: { SearchBar },

  data() {
    return {
      // Saisie en cours, liée à SearchBar via v-model.
      query: ''
    }
  },

  methods: {
    /**
     * Validation de la recherche depuis l'accueil.
     * On redirige vers /search?q=<terme> : l'URL devient partageable
     * et le bouton précédent/suivant du navigateur fonctionne naturellement.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    }
  }
}
</script>