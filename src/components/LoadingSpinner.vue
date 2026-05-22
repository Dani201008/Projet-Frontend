<!--
  Fichier  : src/components/LoadingSpinner.vue
  Auteur   : Samuel
  Rôle     : Indicateur de chargement accessible.
  Créé le  : 08.05.2026
  Modifié  : 22.05.2026
-->
<template>
  <!-- aria-live="polite" : le message sera lu par les lecteurs d'écran. -->
  <div role="status" aria-live="polite" class="flex flex-col items-center gap-4 p-8">

    <!-- Le cercle qui tourne (purement visuel). -->
    <div
        class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin"
        aria-hidden="true"
    ></div>

    <!-- Texte sous le spinner. -->
    <p class="text-gray-500 text-sm">{{ message }}</p>

  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',

  props: {
    // Texte affiché sous le spinner, modifiable selon le contexte.
    message: {
      type: String,
      default: 'Chargement...'
    }
  }
}
</script>
