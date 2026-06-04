/**
 * Fichier  : src/stores/books.js
 * Auteur   : Dani
 * Rôle     : Store Pinia de la recherche (requête, résultats, tri/filtre, pagination).
 * Créé le  : 29.05.2026
 * Modifié  : 04.06.2026
 */

import { defineStore } from 'pinia'
import { searchBooks } from '@/services/openLibrary.js'

const RESULTS_PER_PAGE = 24

// Transforme un document brut de l'API en objet simple que l'UI sait afficher.
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
    loadingMore: false,
    error: null,
    total: 0,
    currentPage: 1,
    // Critère de tri courant et année minimale : filtres appliqués côté client.
    sortBy: 'relevance',
    minYear: ''
  }),
  getters: {
    // Vrai tant qu'on a chargé moins de livres que le total annoncé par l'API.
    hasMore: (state) => state.results.length < state.total,
    /**
     * Résultats après filtre (année min.) puis tri (titre ou année).
     * Calculé à la volée et sur une copie : on ne touche jamais à `results`,
     * la liste brute renvoyée par l'API.
     */
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
      // Recherche vide : on repart d'un état propre plutôt que d'appeler l'API pour rien.
      if (!trimmed) {
        this.reset()
        return
      }
      this.loading = true
      this.error = null
      this.query = trimmed
      this.currentPage = 1
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
    },
    /**
     * Charge la page suivante et l'ajoute aux résultats déjà affichés
     * (pagination « Charger plus », sans remplacer la liste courante).
     */
    async loadMore() {
      if (this.loadingMore || this.loading || !this.hasMore) return
      this.loadingMore = true
      this.error = null
      try {
        const nextPage = this.currentPage + 1
        const data = await searchBooks(this.query, { limit: RESULTS_PER_PAGE, page: nextPage })
        const newBooks = (data.docs || []).map(mapBook)
        this.results = [...this.results, ...newBooks]
        this.currentPage = nextPage
      } catch (err) {
        console.error('Erreur chargement supplémentaire :', err)
        this.error = 'Impossible de charger plus de résultats.'
      } finally {
        this.loadingMore = false
      }
    },
    // Remet tout l'état de recherche à zéro (requête, résultats, filtres, pagination).
    reset() {
      this.query = ''
      this.results = []
      this.error = null
      this.total = 0
      this.currentPage = 1
      this.sortBy = 'relevance'
      this.minYear = ''
    }
  }
})
