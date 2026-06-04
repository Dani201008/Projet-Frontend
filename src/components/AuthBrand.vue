<!--
  Fichier  : src/components/AuthBrand.vue
  Auteur   : Samuel
  Rôle     : Bandeau de marque (logo + phrase d'accroche) en tête des pages connexion / inscription.
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- Dégradé repris du hero d'accueil : explique d'un coup d'œil à quoi sert le site. -->
  <div class="bg-gradient-to-br from-primary to-primary-dark text-white text-center px-8 py-7">
    <div class="text-4xl mb-1">📚</div>
    <h1 class="text-2xl font-bold">Media Explorer</h1>
    <p class="text-sm opacity-90 mt-1.5 max-w-xs mx-auto">
      Recherchez parmi des millions de livres via OpenLibrary et gardez vos favoris au même endroit.
    </p>
  </div>
</template>

<script>
export default {
  name: 'AuthBrand'
}
</script>
