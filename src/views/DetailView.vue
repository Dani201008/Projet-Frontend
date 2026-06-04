<!--
  Fichier  : src/views/DetailView.vue
  Auteur   : Timmy (2.2), puis Dani (3.4 — bouton favori)
  Rôle     : Fiche détaillée d'un livre (couverture, auteurs, description, sujets, favori).
  Créé le  : 22.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <section class="flex flex-col gap-6">
    <button type="button" class="self-start border border-blue-700 text-blue-700 px-4 py-2 rounded-lg" @click="goBack">
      ← Retour
    </button>

    <LoadingSpinner v-if="loading" message="Chargement des détails..." />

    <ErrorMessage
      v-else-if="error"
      :message="error"
      :can-retry="true"
      @retry="fetchDetails"
    />

    <article v-else-if="book" class="grid gap-8 bg-white p-8 rounded-xl shadow-sm md:grid-cols-[280px_1fr]">
      <div class="aspect-[2/3] bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center">
        <img v-if="coverUrl" :src="coverUrl" :alt="`Couverture de ${book.title}`" class="w-full h-full object-cover" />
        <div v-else class="text-7xl text-blue-700/50">📖</div>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">{{ book.title }}</h1>

        <div class="flex flex-col gap-1 text-sm text-gray-500">
          <span v-if="authorsText"><strong class="text-gray-900">✍️ Auteur(s) :</strong> {{ authorsText }}</span>
          <span v-if="book.firstPublishDate"><strong class="text-gray-900">📅 Publié :</strong> {{ book.firstPublishDate }}</span>
        </div>

        <button
          type="button"
          class="self-start px-5 py-2.5 rounded-lg font-medium text-white"
          :class="isFav ? 'bg-red-600' : 'bg-blue-700'"
          @click="toggleFavorite"
        >
          {{ isFav ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris' }}
        </button>

        <div v-if="description" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Description</h2>
          <p class="leading-relaxed whitespace-pre-line">{{ description }}</p>
        </div>

        <div v-if="subjects.length" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Sujets</h2>
          <div class="flex flex-wrap gap-1">
            <span v-for="subject in subjects" :key="subject" class="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs">
              {{ subject }}
            </span>
          </div>
        </div>

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
import { getWorkDetails, getAuthor, getCoverUrl } from '@/services/openLibrary.js'
import { useFavoritesStore } from '@/stores/favorites.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  name: 'DetailView',
  components: { LoadingSpinner, ErrorMessage },
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      book: null,
      loading: false,
      error: null
    }
  },
  computed: {
    favoritesStore() {
      return useFavoritesStore()
    },
    coverUrl() {
      return getCoverUrl(this.book?.coverId, 'L')
    },
    isFav() {
      return this.book && this.favoritesStore.isFavorite(this.book.id)
    },
    authorsText() {
      if (!this.book?.authors?.length) return ''
      return this.book.authors.join(', ')
    },
    description() {
      if (!this.book?.description) return ''
      return typeof this.book.description === 'string'
        ? this.book.description
        : this.book.description.value || ''
    },
    subjects() {
      if (!this.book?.subjects) return []
      return this.book.subjects.slice(0, 12)
    }
  },
  watch: {
    id() {
      this.fetchDetails()
    }
  },
  mounted() {
    this.fetchDetails()
  },
  methods: {
    async fetchDetails() {
      this.loading = true
      this.error = null
      try {
        const data = await getWorkDetails(this.id)
        let authorNames = []
        if (data.authors?.length) {
          const authorKeys = data.authors
            .map(a => a.author?.key?.replace('/authors/', ''))
            .filter(Boolean)
          const results = await Promise.all(
            authorKeys.map(key => getAuthor(key).catch(() => null))
          )
          authorNames = results.filter(Boolean).map(a => a.name)
        }
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
        this.error = 'Impossible de charger les détails de ce livre.'
      } finally {
        this.loading = false
      }
    },
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
    extractYear(dateString) {
      if (!dateString) return null
      const match = String(dateString).match(/\d{4}/)
      return match ? Number(match[0]) : null
    },
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
