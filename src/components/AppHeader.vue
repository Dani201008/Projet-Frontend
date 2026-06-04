<!--
  Fichier  : src/components/AppHeader.vue
  Auteur   : Samuel
  Rôle     : Barre de navigation principale (header sticky)
            Contient le logo, les liens de navigation et le compteur de favoris.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->

<template>
  <!-- Header sticky en haut de la page -->
  <header class="sticky top-0 z-10 bg-blue-700 text-white shadow-sm">

    <div class="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

      <!-- Logo + lien vers la page d'accueil -->
      <router-link
          :to="{ name: 'home' }"
          class="flex items-center gap-2 font-bold text-lg"
          @click="closeMenu"
      >
        <span class="text-2xl">📚</span>
        <span>Media Explorer</span>
      </router-link>

      <!-- Bouton menu mobile (hamburger) -->
      <button
          type="button"
          class="md:hidden flex flex-col gap-1 p-2"
          :aria-expanded="menuOpen"
          aria-label="Ouvrir le menu"
          @click="toggleMenu"
      >
        <span class="block w-6 h-0.5 bg-white"></span>
        <span class="block w-6 h-0.5 bg-white"></span>
        <span class="block w-6 h-0.5 bg-white"></span>
      </button>

      <!-- Navigation principale -->
      <nav
          class="absolute top-16 left-0 right-0 bg-blue-700 shadow-md flex-col p-2
                 md:static md:shadow-none md:flex md:flex-row md:items-center md:gap-2 md:p-0"
          :class="menuOpen ? 'flex' : 'hidden md:flex'"
      >

        <!-- Lien Accueil -->
        <router-link
            :to="{ name: 'home' }"
            class="px-4 py-3 md:py-2 rounded-md hover:bg-white/20"
            active-class="bg-white/20"
            @click="closeMenu"
        >
          Accueil
        </router-link>

        <!-- Lien Recherche -->
        <router-link
            :to="{ name: 'search' }"
            class="px-4 py-3 md:py-2 rounded-md hover:bg-white/20"
            active-class="bg-white/20"
            @click="closeMenu"
        >
          Recherche
        </router-link>

        <!-- Lien Favoris avec compteur -->
        <router-link
            :to="{ name: 'favorites' }"
            class="px-4 py-3 md:py-2 rounded-md hover:bg-white/20 inline-flex items-center gap-1"
            active-class="bg-white/20"
            @click="closeMenu"
        >
          Favoris

          <!-- Badge compteur de favoris -->
          <span
              v-if="favoritesCount"
              class="inline-block min-w-5 h-5 px-1.5 text-xs font-semibold leading-5 text-center bg-red-600 rounded-full"
          >
            {{ favoritesCount }}
          </span>
        </router-link>

      </nav>
    </div>
  </header>
</template>

<script>

// Store Pinia pour accéder aux favoris
import { useFavoritesStore } from '@/stores/favorites.js'

export default {

  name: 'AppHeader',

  data() {
    return {
      // État du menu mobile (ouvert / fermé)
      menuOpen: false
    }
  },

  computed: {

    /**
     * Accès au store des favoris
     */
    favoritesStore() {
      return useFavoritesStore()
    },

    /**
     * Nombre total de livres en favoris
     */
    favoritesCount() {
      return this.favoritesStore.count
    }
  },

  methods: {

    /**
     * Ouvre ou ferme le menu mobile
     */
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },

    /**
     * Ferme le menu mobile (après navigation)
     */
    closeMenu() {
      this.menuOpen = false
    }
  }
}
</script>