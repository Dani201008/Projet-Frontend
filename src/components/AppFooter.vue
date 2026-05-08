<!--
  Fichier  : src/components/AppFooter.vue
  Auteur   : Samuel
  Rôle     : Pied de page : copyright + crédit OpenLibrary.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <footer class="bg-white border-t border-gray-200 px-4 py-6 mt-auto">
    <div class="max-w-7xl mx-auto text-center text-sm text-gray-500">
      <p>© {{ currentYear }} Media Explorer — Projet scolaire</p>
      <p class="text-xs">
        Données fournies par
        <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" class="text-blue-700">OpenLibrary</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    /**
     * Année actuelle, recalculée à chaque rendu.
     * Évite d'avoir à mettre à jour le footer à la main chaque 1er janvier.
     */
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>