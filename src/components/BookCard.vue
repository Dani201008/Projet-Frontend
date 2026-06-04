<template>
  <!-- Carte représentant un livre -->
  <article class="relative bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">

    <!-- Lien vers la page de détail du livre -->
    <router-link
        :to="{ name: 'detail', params: { id: book.id } }"
        class="flex flex-col h-full text-inherit"
    >

      <!-- Zone image / couverture -->
      <div class="aspect-[2/3] bg-blue-50 flex items-center justify-center overflow-hidden">

        <!-- Affichage de la couverture si disponible -->
        <img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="`Couverture de ${book.title}`"
            class="w-full h-full object-cover"
            loading="lazy"
        />

        <!-- Icône par défaut si aucune couverture -->
        <div v-else class="text-5xl text-blue-700/50">📖</div>
      </div>

      <!-- Informations sur le livre -->
      <div class="p-4 flex flex-col gap-1">

        <!-- Titre du livre -->
        <h3 class="text-base font-semibold leading-tight" :title="book.title">
          {{ book.title }}
        </h3>

        <!-- Auteurs -->
        <p class="text-sm text-gray-500 truncate">
          ✍️ {{ authorsText }}
        </p>

        <!-- Année de publication (si disponible) -->
        <p v-if="book.year" class="text-sm text-gray-500">
          📅 {{ book.year }}
        </p>
      </div>

    </router-link>

    <!-- Bouton favoris (coeur) -->
    <button
        type="button"
        class="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-sm"
        :class="isFav ? 'bg-red-600 text-white' : 'bg-white/90 text-red-600'"
        :aria-label="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        @click.stop="toggleFavorite"
    >
      <!-- Icône coeur plein ou vide selon l'état -->
      {{ isFav ? '♥' : '♡' }}
    </button>

  </article>
</template>

<script>

// Store Pinia pour gérer les favoris
import { useFavoritesStore } from '@/stores/favorites.js'

// Service permettant de générer l'URL de la couverture
import { getCoverUrl } from '@/services/openLibrary.js'

export default {

  name: 'BookCard',

  props: {
    // Objet livre reçu depuis le composant parent
    book: { type: Object, required: true }
  },

  computed: {

    /**
     * Accès au store des favoris
     */
    favoritesStore() {
      return useFavoritesStore()
    },

    /**
     * Génère l'URL de la couverture du livre
     */
    coverUrl() {
      return getCoverUrl(this.book.coverId, 'M')
    },

    /**
     * Vérifie si le livre est déjà en favori
     */
    isFav() {
      return this.favoritesStore.isFavorite(this.book.id)
    },

    /**
     * Formate l'affichage des auteurs
     * - affiche jusqu'à 2 auteurs
     * - indique le nombre restant si plus de 2
     */
    authorsText() {
      if (!this.book.authors || !this.book.authors.length)
        return 'Auteur inconnu'

      const visible = this.book.authors.slice(0, 2).join(', ')
      const extra = this.book.authors.length - 2

      return extra > 0
          ? `${visible} +${extra}`
          : visible
    }
  },

  methods: {

    /**
     * Ajoute ou retire le livre des favoris
     */
    toggleFavorite() {
      this.favoritesStore.toggle(this.book)
    }
  }
}
</script>