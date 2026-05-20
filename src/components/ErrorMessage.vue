<!--
  Fichier  : src/components/ErrorMessage.vue
  Auteur   : Dani
  Rôle     : Encart d'erreur avec bouton « Réessayer » optionnel.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <!-- role="alert" : les lecteurs d'écran lisent immédiatement le message. -->
  <div role="alert" class="flex gap-4 p-6 bg-red-50 border border-red-300 rounded-lg text-red-900">
    <span class="text-2xl">⚠️</span>
    <div class="flex-1 flex flex-col gap-2 items-start">
      <p>{{ message }}</p>
      <!-- Bouton « Réessayer » affiché seulement si le parent l'a demandé via la prop canRetry. -->
      <button v-if="canRetry" type="button" class="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg" @click="$emit('retry')">
        Réessayer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: { type: String, required: true },
    canRetry: { type: Boolean, default: false }
  },
  // Émis quand l'utilisateur clique sur « Réessayer » : c'est au parent de relancer l'action.
  emits: ['retry']
}
</script>
