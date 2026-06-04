<!--
  Fichier  : src/components/AppHeader.vue
  Auteur   : Samuel (1.2), Timmy (3.5 — menu mobile + Favoris), Samuel (auth + refonte visuelle)
  Rôle     : Barre de navigation sticky (logo, liens, badge favoris, utilisateur, menu mobile).
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- sticky top-0 : reste collé en haut. bg-primary = même bleu que le hero (transition continue). -->
  <header class="sticky top-0 z-10 bg-primary text-white shadow-sm">
    <div class="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo cliquable, renvoie à l'accueil. -->
      <router-link
        :to="{ name: 'home' }"
        class="flex items-center gap-2 font-bold"
        @click="closeMenu"
      >
        <AppIcon name="book-open" :size="26" :stroke-width="1.6" />
        <span class="font-serif text-xl tracking-tight">Media Explorer</span>
      </router-link>

      <!--
        Navigation affichée seulement quand l'utilisateur est connecté.
        Sur les pages de connexion / inscription, l'en-tête ne montre que le logo.
      -->
      <template v-if="auth.isAuthenticated">
        <!-- Bouton menu : visible seulement sur mobile (md:hidden). -->
        <button
          type="button"
          class="md:hidden p-2 -mr-2"
          :aria-expanded="menuOpen"
          aria-label="Ouvrir le menu"
          @click="toggleMenu"
        >
          <AppIcon name="menu" :size="24" />
        </button>

        <!-- Menu déroulant sur mobile, barre horizontale classique dès md. -->
        <nav
          class="absolute top-16 left-0 right-0 bg-primary shadow-md flex-col p-2 md:static md:shadow-none md:flex md:flex-row md:items-center md:gap-1 md:p-0"
          :class="menuOpen ? 'flex' : 'hidden md:flex'"
        >
          <router-link :to="{ name: 'home' }" class="px-4 py-3 md:py-2 rounded-md hover:bg-white/15" active-class="bg-white/20" @click="closeMenu">Accueil</router-link>
          <router-link :to="{ name: 'search' }" class="px-4 py-3 md:py-2 rounded-md hover:bg-white/15" active-class="bg-white/20" @click="closeMenu">Recherche</router-link>
          <router-link :to="{ name: 'favorites' }" class="px-4 py-3 md:py-2 rounded-md hover:bg-white/15 inline-flex items-center gap-1.5" active-class="bg-white/20" @click="closeMenu">
            Favoris
            <!-- Badge : nombre de favoris, masqué quand il n'y en a aucun. -->
            <span
              v-if="favoritesCount"
              class="inline-block min-w-5 h-5 px-1.5 text-xs font-semibold leading-5 text-center bg-accent rounded-full"
            >
              {{ favoritesCount }}
            </span>
          </router-link>

          <!-- Utilisateur connecté + déconnexion, séparés visuellement. -->
          <span class="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white/90 md:ml-2 md:pl-3 md:border-l md:border-white/25">
            <AppIcon name="user" :size="16" /> {{ auth.currentUser.name }}
          </span>
          <button type="button" class="inline-flex items-center gap-1.5 px-4 py-3 md:py-2 text-left rounded-md hover:bg-white/15" @click="logout">
            <AppIcon name="log-out" :size="16" /> Déconnexion
          </button>
        </nav>
      </template>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import AppIcon from '@/components/AppIcon.vue'

export default {
  name: 'AppHeader',
  components: { AppIcon },
  data() {
    return {
      // Ouverture du menu déroulant sur mobile.
      menuOpen: false
    }
  },
  computed: {
    auth() {
      return useAuthStore()
    },
    favoritesStore() {
      return useFavoritesStore()
    },
    favoritesCount() {
      return this.favoritesStore.count
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    closeMenu() {
      this.menuOpen = false
    },
    logout() {
      this.closeMenu()
      this.auth.logout()
      // Renvoie vers la page de connexion après déconnexion.
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
