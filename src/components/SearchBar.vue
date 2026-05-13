<!--
  Fichier  : src/components/SearchBar.vue
  Auteur   : Timmy
  Rôle     : Barre de recherche réutilisable (pattern v-model).
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <!-- @submit.prevent : on intercepte la touche Entrée et on évite le rechargement de page. -->
  <form class="flex flex-col gap-2 sm:flex-row" role="search" @submit.prevent="onSubmit">
    <!-- Label invisible mais lu par les lecteurs d'écran (accessibilité). -->
    <label for="search-input" class="sr-only">Rechercher un livre</label>

    <div class="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-lg px-4">
      <span aria-hidden="true">🔍</span>
      <input
          id="search-input"
          v-model="localQuery"
          type="text"
          :placeholder="placeholder"
          autocomplete="off"
          class="flex-1 border-0 outline-none bg-transparent py-3"
      />
      <!-- Croix « × » : visible seulement quand on a tapé, vide le champ d'un clic. -->
      <button v-if="localQuery" type="button" class="text-2xl text-gray-400" @click="clear">×</button>
    </div>

    <!-- Désactivé tant que la saisie est vide ou ne contient que des espaces. -->
    <button type="submit" class="bg-blue-700 text-white px-5 py-2.5 rounded-lg" :disabled="!localQuery.trim()">
      Rechercher
    </button>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',

  // Valeurs reçues du parent.
  props: {
    // Valeur du champ, lue/écrite depuis le parent via v-model.
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Rechercher un livre, un auteur...' }
  },

  // Événements émis vers le parent (v-model + submit).
  emits: ['update:modelValue', 'submit'],

  data() {
    return {
      // Copie locale de la prop : Vue interdit de muter une prop directement,
      // donc on travaille sur cette copie et on émet les changements au parent.
      localQuery: this.modelValue
    }
  },

  watch: {
    // Si le parent change la valeur (ex. via le router), on synchronise la copie locale.
    modelValue(value) {
      this.localQuery = value
    },
    // Quand l'utilisateur tape, on prévient le parent pour garder le v-model à jour.
    localQuery(value) {
      this.$emit('update:modelValue', value)
    }
  },

  methods: {
    /**
     * Appelée quand l'utilisateur valide le formulaire.
     * On nettoie les espaces et on émet `submit` uniquement si la saisie n'est pas vide.
     */
    onSubmit() {
      const trimmed = this.localQuery.trim()
      if (trimmed) {
        this.$emit('submit', trimmed)
      }
    },

    /**
     * Vide le champ. Utilisé par le bouton « × ».
     */
    clear() {
      this.localQuery = ''
      this.$emit('update:modelValue', '')
    }
  }
}
</script>
✎ src/views/HomeView.vue
Tu remplaces complètement le contenu précédent par :

<!--
  Fichier  : src/views/HomeView.vue
  Auteur   : Timmy
  Rôle     : Page d'accueil avec barre de recherche.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
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