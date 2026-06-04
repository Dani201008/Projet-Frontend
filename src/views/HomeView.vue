<!--
  Fichier  : src/views/HomeView.vue
  Auteur   : Timmy
  Rôle     : Page d'accueil : hero, barre de recherche, suggestions et points forts.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <section class="flex flex-col gap-8">
    <div class="text-center px-4 py-10 sm:py-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-md">
      <h1 class="text-3xl sm:text-4xl font-bold mb-4">Découvrez des millions de livres</h1>
      <p class="text-base sm:text-lg opacity-95 max-w-xl mx-auto mb-6">
        Recherchez un titre, un auteur ou un sujet et plongez dans la base de données <strong>OpenLibrary</strong>.
      </p>
      <SearchBar v-model="query" @submit="onSearch" />

      <!-- Quelques recherches d'exemple pour démarrer en un clic. -->
      <div class="mt-6 flex flex-wrap gap-2 justify-center items-center">
        <span class="text-sm opacity-90">Essayez :</span>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full text-sm hover:bg-white/35"
          @click="onSearch(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Trois points forts de l'application. -->
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-3">
      <div class="bg-white p-6 rounded-lg text-center shadow-sm">
        <div class="text-4xl mb-2">🔎</div>
        <h3 class="text-lg font-semibold mb-1">Recherche rapide</h3>
        <p class="text-gray-500 text-sm">Interrogez OpenLibrary en temps réel.</p>
      </div>
      <div class="bg-white p-6 rounded-lg text-center shadow-sm">
        <div class="text-4xl mb-2">🧭</div>
        <h3 class="text-lg font-semibold mb-1">Tri &amp; filtres</h3>
        <p class="text-gray-500 text-sm">Affinez vos résultats par année ou par titre.</p>
      </div>
      <div class="bg-white p-6 rounded-lg text-center shadow-sm">
        <div class="text-4xl mb-2">❤️</div>
        <h3 class="text-lg font-semibold mb-1">Favoris</h3>
        <p class="text-gray-500 text-sm">Gardez sous la main les livres qui vous intéressent.</p>
      </div>
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
      query: '',
      // Recherches proposées en un clic sous la barre.
      suggestions: ['Harry Potter', 'Albert Camus', 'Science-Fiction', 'Victor Hugo']
    }
  },
  methods: {
    /**
     * Validation de la recherche depuis l'accueil.
     * On redirige vers /search?q=<terme> : l'URL devient partageable
     * et les boutons précédent / suivant du navigateur fonctionnent naturellement.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    }
  }
}
</script>
