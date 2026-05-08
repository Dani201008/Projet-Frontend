<!--
  Fichier  : src/components/AppHeader.vue
  Auteur   : Samuel
  Rôle     : Barre de navigation sticky (logo + liens).
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <!-- sticky top-0 : reste collé en haut quand on scrolle. -->
  <header class="sticky top-0 z-10 bg-blue-700 text-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo cliquable, renvoie à l'accueil. -->
      <router-link :to="{ name: 'home' }" class="flex items-center gap-2 font-bold text-lg">
        <span class="text-2xl">📚</span>
        <span>Media Explorer</span>
      </router-link>

      <!-- Liens de navigation. Pour l'instant 2 ; le lien Favoris sera ajouté au Sprint 3. -->
      <nav class="flex items-center gap-2">
        <router-link :to="{ name: 'home' }" class="px-3 py-2 rounded-md hover:bg-white/20">Accueil</router-link>
        <router-link :to="{ name: 'search' }" class="px-3 py-2 rounded-md hover:bg-white/20">Recherche</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>