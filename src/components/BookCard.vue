<!--
  Fichier  : src/components/BookCard.vue
  Auteur   : Timmy (1.4), puis Dani (3.4, bouton favori)
  Rôle     : Carte d'un livre (couverture, titre, auteurs, année) avec bouton favori.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <article class="relative bg-white rounded-xl overflow-hidden shadow-sm flex flex-col transition duration-200 hover:-translate-y-1 hover:shadow-md">
    <!-- Toute la carte est cliquable : un router-link englobe la couverture et les infos. -->
    <router-link
      :to="{ name: 'detail', params: { id: book.id } }"
      class="flex flex-col h-full text-inherit"
    >
      <!-- aspect-[2/3] : ratio classique des couvertures de livre. -->
      <div class="aspect-[2/3] bg-blue-50 flex items-center justify-center overflow-hidden">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          :alt="`Couverture de ${book.title}`"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <!-- Fallback si pas de couverture : icône livre. -->
        <AppIcon v-else name="book" :size="46" :stroke-width="1.4" class="text-primary/40" />
      </div>
      <div class="p-4 flex flex-col gap-1">
        <h3 class="text-base font-semibold leading-tight" :title="book.title">{{ book.title }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ authorsText }}</p>
        <!-- Année affichée seulement si on l'a (l'API ne la donne pas toujours). -->
        <p v-if="book.year" class="text-sm text-gray-400">{{ book.year }}</p>
      </div>
    </router-link>

    <!--
      Bouton favori superposé en haut à droite de la carte.
      @click.stop empêche le clic de déclencher aussi le router-link parent.
    -->
    <button
      type="button"
      class="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition"
      :class="isFav ? 'bg-rose-600 text-white' : 'bg-white/90 text-rose-600 hover:bg-white'"
      :aria-label="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      @click.stop="toggleFavorite"
    >
      <AppIcon name="heart" :filled="isFav" :size="18" />
    </button>
  </article>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites.js'
import { useAuthStore } from '@/stores/auth.js'
import { getCoverUrl } from '@/services/openLibrary.js'
import AppIcon from '@/components/AppIcon.vue'

export default {
  name: 'BookCard',
  components: { AppIcon },

  props: {
    // Objet livre : { id, title, authors, year, coverId }
    book: { type: Object, required: true }
  },

  computed: {
    favoritesStore() {
      return useFavoritesStore()
    },

    /**
     * URL de la couverture en taille moyenne ('M').
     * Renvoie null si pas de couverture → le placeholder s'affiche à la place.
     */
    coverUrl() {
      return getCoverUrl(this.book.coverId, 'M')
    },

    // Vrai si ce livre figure déjà dans les favoris.
    isFav() {
      return this.favoritesStore.isFavorite(this.book.id)
    },

    /**
     * Texte des auteurs, limité à 2 pour garder la carte lisible.
     * Exemples :
     *   []                                   → "Auteur inconnu"
     *   ["Hugo"]                             → "Hugo"
     *   ["Hugo", "Zola"]                     → "Hugo, Zola"
     *   ["Hugo", "Zola", "Balzac"]           → "Hugo, Zola +1"
     *   ["Hugo", "Zola", "Balzac", "Camus"]  → "Hugo, Zola +2"
     */
    authorsText() {
      if (!this.book.authors || !this.book.authors.length) return 'Auteur inconnu'
      const visible = this.book.authors.slice(0, 2).join(', ')
      const extra = this.book.authors.length - 2
      return extra > 0 ? `${visible} +${extra}` : visible
    }
  },

  methods: {
    toggleFavorite() {
      // Action liée à un compte : on redirige vers la connexion si le visiteur n'est pas identifié.
      if (!useAuthStore().isAuthenticated) {
        this.$router.push({ name: 'login' })
        return
      }
      this.favoritesStore.toggle(this.book)
    }
  }
}
</script>
