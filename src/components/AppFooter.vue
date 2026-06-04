<!--
  Fichier  : src/components/AppFooter.vue
  Auteur   : Samuel
  Rôle     : Pied de page : marque, copyright et crédit OpenLibrary.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- bg-primary-dark : même famille de bleu que le header et le hero, en plus profond. -->
  <footer class="bg-primary-dark text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <!-- Marque. -->
      <div class="flex items-center justify-center gap-2 sm:justify-start">
        <AppIcon name="book-open" :size="20" :stroke-width="1.6" />
        <span class="font-serif text-lg">Media Explorer</span>
      </div>

      <p class="text-sm text-white/70">© {{ currentYear }} · Projet scolaire CPNV</p>

      <!-- Crédit de la source de données. -->
      <a
        href="https://openlibrary.org"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-1.5 text-sm text-white/80 hover:text-white"
      >
        Données : OpenLibrary
        <AppIcon name="external" :size="14" />
      </a>
    </div>
  </footer>
</template>

<script>
import AppIcon from '@/components/AppIcon.vue'

export default {
  name: 'AppFooter',
  components: { AppIcon },
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
