<!--
  Fichier  : src/components/BookCard.vue
  Auteur   : Timmy
  Rôle     : Carte d'un livre (couverture, titre, auteurs, année).
  Créé le  : 08.05.2026
  Modifié  : 10.05.2026
-->
<template>
  <article class="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
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
        <div v-else class="text-5xl text-blue-700/50">📖</div>
      </div>
      <div class="p-4 flex flex-col gap-1">
        <h3 class="text-base font-semibold leading-tight" :title="book.title">{{ book.title }}</h3>
        <p class="text-sm text-gray-500 truncate"> {{ authorsText }}</p>
        <!-- Année affichée seulement si on l'a (l'API ne la donne pas toujours). -->
        <p v-if="book.year" class="text-sm text-gray-500"> {{ book.year }}</p>
      </div>
    </router-link>
  </article>
</template>

<script>
import { getCoverUrl } from '@/services/openLibrary.js'

export default {
  name: 'BookCard',

  props: {
    // Objet livre : { id, title, authors, year, coverId }
    book: { type: Object, required: true }
  },

  computed: {
    /**
     * URL de la couverture en taille moyenne ('M').
     * Renvoie null si pas de couverture → le placeholder s'affiche à la place.
     */
    coverUrl() {
      return getCoverUrl(this.book.coverId, 'M')
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
  }
}
</script>