<!--
  Fichier  : src/App.vue
  Auteur   : Samuel
  Rôle     : Composant racine : header + page courante + footer.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <!-- Conteneur global : prend toute la hauteur de l'écran et empile les enfants verticalement. -->
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Zone principale qui change selon la route ; flex-1 pousse le footer vers le bas. -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>