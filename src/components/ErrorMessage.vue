<!--
  Fichier  : src/components/ErrorMessage.vue
  Auteur   : Samuel
  Rôle     : Encart d'erreur avec bouton « Réessayer » optionnel.
  Créé le  : 08.05.2026
  Modifié  : 22.05.2026
-->
<template>
  <!-- role="alert" : le lecteur d'écran annonce le message tout de suite. -->
  <div role="alert" class="flex gap-4 p-6 bg-red-50 border border-red-300 rounded-lg text-red-900">

    <!-- Icône décorative. -->
    <span class="text-2xl" aria-hidden="true">⚠️</span>

    <div class="flex-1 flex flex-col gap-2 items-start">

      <!-- Message d'erreur passé par le parent. -->
      <p>{{ message }}</p>

      <!-- Bouton "Réessayer", affiché uniquement si le parent le veut. -->
      <button
          v-if="canRetry"
          type="button"
          class="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg"
          @click="$emit('retry')"
      >
        Réessayer
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',

  props: {
    // Texte de l'erreur à afficher.
    message: {
      type: String,
      required: true
    },

    // À mettre à true si on veut le bouton "Réessayer".
    canRetry: {
      type: Boolean,
      default: false
    }
  },

  // Émis au clic sur "Réessayer". Le parent gère la suite.
  emits: ['retry']
}
</script>
