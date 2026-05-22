<!--
  Fichier  : src/views/DetailView.vue
  Auteur   : Timmy
  Rôle     : Affiche les détails d’un livre sélectionné depuis la recherche.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
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
    coverUrl() {
      return getCoverUrl(this.book?.coverId, 'L')
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