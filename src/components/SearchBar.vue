<!--
  Fichier  : src/components/SearchBar.vue
  Auteur   : Samuel
  Rôle     : Barre de recherche réutilisable (pattern v-model).
  Créé le  : 08.05.2026
  Modifié  : 22.05.2026, ajout text-gray-900 pour éviter le texte blanc sur fond blanc dans le hero.
-->
<template>
  <!-- .prevent évite le rechargement de la page quand on appuie sur Entrée. -->
  <form class="flex flex-col gap-2 sm:flex-row" role="search" @submit.prevent="onSubmit">
    <!-- Label caché visuellement mais lu par les lecteurs d'écran. -->
    <label for="search-input" class="sr-only">Rechercher un livre</label>

    <!-- text-gray-900 force le texte en foncé même quand le parent a text-white (cas du hero). -->
    <div class="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-lg px-4 text-gray-900">
      <span aria-hidden="true">🔍</span>
      <input
          id="search-input"
          v-model="localQuery"
          type="text"
          :placeholder="placeholder"
          autocomplete="off"
          class="flex-1 border-0 outline-none bg-transparent py-3"
      />
      <!-- Petite croix pour vider le champ d'un clic. -->
      <button v-if="localQuery" type="button" class="text-2xl text-gray-400" @click="clear">×</button>
    </div>

    <!-- Désactivé si le champ est vide ou ne contient que des espaces. -->
    <button type="submit" class="bg-blue-700 text-white px-5 py-2.5 rounded-lg" :disabled="!localQuery.trim()">
      Rechercher
    </button>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',

  props: {
    // Valeur du champ (v-model).
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Rechercher un livre, un auteur...' }
  },

  // Événements remontés au parent.
  emits: ['update:modelValue', 'submit'],

  data() {
    return {
      // Copie locale, parce qu'on n'a pas le droit de modifier une prop directement.
      localQuery: this.modelValue
    }
  },

  watch: {
    // Si le parent change la valeur (ex: via le router), on suit.
    modelValue(value) {
      this.localQuery = value
    },
    // Quand l'utilisateur tape, on prévient le parent.
    localQuery(value) {
      this.$emit('update:modelValue', value)
    }
  },

  methods: {
    // Validation du formulaire : on émet 'submit' si le champ n'est pas vide.
    onSubmit() {
      const trimmed = this.localQuery.trim()
      if (trimmed) {
        this.$emit('submit', trimmed)
      }
    },

    // Vide le champ (utilisé par le bouton ×).
    clear() {
      this.localQuery = ''
      this.$emit('update:modelValue', '')
    }
  }
}
</script>
