<!--
  Fichier  : src/views/SearchView.vue
  Fichier  : src/views/DetailView.vue
  Auteur   : Timmy
  Rôle     : Affiche les détails d’un livre sélectionné depuis la recherche.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->

<template>
  <section class="flex flex-col gap-6">

    <!-- Bouton retour vers la page précédente ou la recherche -->
    <button
        type="button"
        class="self-start border border-blue-700 text-blue-700 px-4 py-2 rounded-lg"
        @click="goBack"
    >
      ← Retour
    </button>

    <!-- Affichage du loader pendant le chargement des données -->
    <LoadingSpinner
        v-if="loading"
        message="Chargement des détails..."
    />

    <!-- Affichage d'un message d'erreur avec possibilité de retry -->
    <ErrorMessage
        v-else-if="error"
        :message="error"
        :can-retry="true"
        @retry="fetchDetails"
    />

    <!-- Affichage principal du livre si les données sont disponibles -->
    <article
        v-else-if="book"
        class="grid gap-8 bg-white p-8 rounded-xl shadow-sm md:grid-cols-[280px_1fr]"
    >

      <!-- Couverture du livre -->
      <div class="aspect-[2/3] bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center">

        <!-- Image de couverture si disponible -->
        <img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="`Couverture de ${book.title}`"
            class="w-full h-full object-cover"
        />

        <!-- Icône par défaut si aucune couverture -->
        <div v-else class="text-7xl text-blue-700/50">📖</div>
      </div>

      <!-- Informations détaillées du livre -->
      <div class="flex flex-col gap-4">

        <!-- Titre -->
        <h1 class="text-2xl font-bold">{{ book.title }}</h1>

        <!-- Métadonnées (auteurs + date de publication) -->
        <div class="flex flex-col gap-1 text-sm text-gray-500">

          <!-- Liste des auteurs -->
          <span v-if="authorsText">
            <strong class="text-gray-900">✍️ Auteur(s) :</strong>
            {{ authorsText }}
          </span>

          <!-- Date de première publication -->
          <span v-if="book.firstPublishDate">
            <strong class="text-gray-900">📅 Publié :</strong>
            {{ book.firstPublishDate }}
          </span>
        </div>

        <!-- Bouton ajout / retrait des favoris -->
        <button
            type="button"
            class="self-start px-5 py-2.5 rounded-lg font-medium text-white"
            :class="isFav ? 'bg-red-600' : 'bg-blue-700'"
            @click="toggleFavorite"
        >
          {{ isFav ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris' }}
        </button>

        <!-- Description du livre -->
        <div v-if="description" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Description</h2>
          <p class="leading-relaxed whitespace-pre-line">
            {{ description }}
          </p>
        </div>

        <!-- Liste des sujets liés au livre -->
        <div v-if="subjects.length" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Sujets</h2>

          <div class="flex flex-wrap gap-1">
            <span
                v-for="subject in subjects"
                :key="subject"
                class="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs"
            >
              {{ subject }}
            </span>
          </div>
        </div>

        <!-- Lien externe vers OpenLibrary -->
        <a
            :href="`https://openlibrary.org/works/${book.id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-blue-700"
        >
          Voir sur OpenLibrary ↗
        </a>

      </div>
    </article>

  </section>
</template>

<script>

// Services API OpenLibrary
import {
  getWorkDetails,
  getAuthor,
  getCoverUrl
} from '@/services/openLibrary.js'

// Store des favoris
import { useFavoritesStore } from '@/stores/favorites.js'

// Composants UI réutilisables
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {

  name: 'DetailView',

  components: {
    LoadingSpinner,
    ErrorMessage
  },

  props: {
    // ID du livre reçu via la route
    id: { type: String, required: true }
  },

  data() {
    return {
      book: null,     // Données complètes du livre
      loading: false, // État de chargement
      error: null     // Message d'erreur éventuel
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
     * Génère l'URL de la couverture du livre
     */
    coverUrl() {
      return getCoverUrl(this.book?.coverId, 'L')
    },

    /**
     * Vérifie si le livre est dans les favoris
     */
    isFav() {
      return this.book &&
          this.favoritesStore.isFavorite(this.book.id)
    },

    /**
     * Formate les auteurs en chaîne lisible
     */
    authorsText() {
      if (!this.book?.authors?.length) return ''
      return this.book.authors.join(', ')
    },

    /**
     * Nettoie et normalise la description
     */
    description() {
      if (!this.book?.description) return ''

      return typeof this.book.description === 'string'
          ? this.book.description
          : this.book.description.value || ''
    },

    /**
     * Limite et retourne les sujets du livre
     */
    subjects() {
      if (!this.book?.subjects) return []
      return this.book.subjects.slice(0, 12)
    }
  },

  watch: {

    /**
     * Recharge les données si l'ID change (navigation)
     */
    id() {
      this.fetchDetails()
    }
  },

  mounted() {
    // Chargement initial des détails
    this.fetchDetails()
  },

  methods: {

    /**
     * Récupère les détails complets du livre depuis l'API
     */
    async fetchDetails() {

      this.loading = true
      this.error = null

      try {
        const data = await getWorkDetails(this.id)

        // Récupération des auteurs
        let authorNames = []

        if (data.authors?.length) {

          const authorKeys = data.authors
              .map(a => a.author?.key?.replace('/authors/', ''))
              .filter(Boolean)

          const results = await Promise.all(
              authorKeys.map(key =>
                  getAuthor(key).catch(() => null)
              )
          )

          authorNames = results
              .filter(Boolean)
              .map(a => a.name)
        }

        // Normalisation des données du livre
        this.book = {
          id: this.id,
          title: data.title || 'Titre inconnu',
          description: data.description,
          subjects: data.subjects || [],
          coverId: data.covers?.[0] || null,
          authors: authorNames,
          firstPublishDate: data.first_publish_date || null
        }

      } catch (err) {

        console.error('Erreur détails :', err)

        this.error =
            'Impossible de charger les détails de ce livre.'

      } finally {
        this.loading = false
      }
    },

    /**
     * Ajoute ou retire le livre des favoris
     */
    toggleFavorite() {
      if (!this.book) return

      this.favoritesStore.toggle({
        id: this.book.id,
        title: this.book.title,
        authors: this.book.authors,
        coverId: this.book.coverId,
        year: this.extractYear(this.book.firstPublishDate)
      })
    },

    /**
     * Extrait l'année depuis une date complète
     */
    extractYear(dateString) {
      if (!dateString) return null
      const match = String(dateString).match(/\d{4}/)
      return match ? Number(match[0]) : null
    },

    /**
     * Retour à la page précédente ou à la recherche
     */
    goBack() {
      if (window.history.length > 1) {
        this.$router.back()
      } else {
        this.$router.push({ name: 'search' })
      }
    }
  }
}
</script>