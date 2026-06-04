<!--
  Fichier  : src/components/SkeletonGrid.vue
  Auteur   : Timmy
  Rôle     : Grille de cartes « fantômes » animées affichée pendant le chargement des résultats.
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- aria-hidden : purement décoratif, on n'annonce pas les squelettes aux lecteurs d'écran. -->
  <div
    class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
    aria-hidden="true"
  >
    <div v-for="n in count" :key="n" class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div class="aspect-[2/3] bg-gray-200"></div>
      <div class="p-4 flex flex-col gap-2">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonGrid',
  props: {
    // Nombre de cartes fantômes à afficher.
    count: { type: Number, default: 12 }
  }
}
</script>
