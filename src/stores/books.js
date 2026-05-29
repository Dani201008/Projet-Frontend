//
//  Fichier  : src/stores/books.js
//  Auteur   : timmy
//  Rôle     : Base de donné des liveres API.
//  Créé le  : 08.05.2026
//  Modifié  : 29.05.2026
//
import { defineStore } from 'pinia'
import { searchBooks } from '@/services/openLibrary.js'

const RESULTS_PER_PAGE = 24

function mapBook(doc) {
    return {
        id: (doc.key || '').replace('/works/', ''),
        title: doc.title || 'Titre inconnu',
        authors: doc.author_name || [],
        year: doc.first_publish_year || null,
        coverId: doc.cover_i || null
    }
}

export const useBooksStore = defineStore('books', {
    state: () => ({
        query: '',
        results: [],
        loading: false,
        error: null,
        total: 0,
        sortBy: 'relevance',
        minYear: ''
    }),
    getters: {
        filteredResults: (state) => {
            let list = [...state.results]
            if (state.minYear) {
                const year = Number(state.minYear)
                list = list.filter(book => book.year && book.year >= year)
            }
            if (state.sortBy === 'title') {
                list.sort((a, b) => a.title.localeCompare(b.title))
            } else if (state.sortBy === 'year') {
                list.sort((a, b) => (b.year || 0) - (a.year || 0))
            }
            return list
        }
    },
    actions: {
        async search(newQuery) {
            const trimmed = (newQuery || '').trim()
            if (!trimmed) {
                this.query = ''
                this.results = []
                return
            }
            this.loading = true
            this.error = null
            this.query = trimmed
            try {
                const data = await searchBooks(trimmed, { limit: RESULTS_PER_PAGE, page: 1 })
                this.results = (data.docs || []).map(mapBook)
                this.total = data.numFound || 0
            } catch (err) {
                console.error('Erreur recherche :', err)
                this.error = 'Impossible de récupérer les résultats. Vérifiez votre connexion.'
                this.results = []
                this.total = 0
            } finally {
                this.loading = false
            }
        }
    }
})