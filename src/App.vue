<!--
  Fichier  : src/App.vue
  Auteur   : Samuel (1.2), Timmy (4.2 — transition), Samuel (favoris liés à la session)
  Rôle     : Composant racine : header + page courante + footer. Synchronise les favoris avec la session.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- Conteneur global : prend toute la hauteur de l'écran et empile les enfants verticalement. -->
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Zone principale qui change selon la route ; flex-1 pousse le footer vers le bas. -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <!-- Transition « fondu » entre les pages : le composant de la route passe par le slot du router-view. -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useFavoritesStore } from '@/stores/favorites.js'

export default {
  name: 'App',
  components: { AppHeader, AppFooter },
  computed: {
    auth() {
      return useAuthStore()
    },
    favorites() {
      return useFavoritesStore()
    }
  },
  watch: {
    // Suit l'état de connexion : on charge les favoris du backend à la connexion,
    // on vide la liste locale à la déconnexion.
    'auth.isAuthenticated'(loggedIn) {
      if (loggedIn) {
        this.favorites.fetchAll()
      } else {
        this.favorites.clear()
      }
    }
  },
  mounted() {
    // Session encore active au chargement (rechargement de page) : on récupère les favoris.
    if (this.auth.isAuthenticated) {
      this.favorites.fetchAll()
    }
  }
}
</script>
