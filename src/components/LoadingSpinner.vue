<!--
  Fichier  : src/components/LoadingSpinner.vue
  Auteur   : Dani
  Rôle     : Indicateur de chargement accessible.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <!-- role="status" + aria-live="polite" : les lecteurs d'écran annoncent l'état de chargement. -->
  <div role="status" aria-live="polite" class="flex flex-col items-center gap-4 p-8">
    <!-- Le cercle qui tourne : bordure presque transparente, sauf le haut qui est foncé. -->
    <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" aria-hidden="true"></div>
    <p class="text-gray-500 text-sm">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    // Message affiché sous le spinner. Personnalisable selon le contexte.
    message: { type: String, default: 'Chargement...' }
  }
}
</script>
