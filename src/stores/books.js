/**
 * Fichier  : src/stores/books.js
 * Auteur   : Dani
 * Rôle     : Store Pinia de la recherche (requête, tri et filtre côté serveur, pagination).
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
    // Tri et filtre appliqués côté serveur : ils portent sur tout le résultat, pas seulement la page.
    sort: 'relevance', // 'relevance' | 'new' | 'old'
    minYear: ''
  }),

  getters: {
    // Vrai tant qu'on a chargé moins de livres que le total annoncé par l'API.
    hasMore: (state) => state.results.length < state.total
  },

  actions: {
    // Requête envoyée à l'API : texte + filtre « année minimale » en syntaxe OpenLibrary.
    buildQuery() {
      let q = this.query
      if (this.minYear) {
        q += ` first_publish_year:[${Number(this.minYear)} TO *]`
      }
      return q
    },

    // Traduit notre tri en paramètre OpenLibrary (la pertinence est le tri par défaut, sans paramètre).
    sortParam() {
      return this.sort === 'new' || this.sort === 'old' ? this.sort : undefined
    },

    async search(newQuery) {
      const trimmed = (newQuery || '').trim()
      if (!trimmed) {
        this.reset()
        return
      }
      this.loading = true
      this.error = null
      this.query = trimmed
      this.currentPage = 1
      try {
        const data = await searchBooks(this.buildQuery(), { limit: RESULTS_PER_PAGE, page: 1, sort: this.sortParam() })
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

    async loadMore() {
      if (this.loadingMore || this.loading || !this.hasMore) return
      this.loadingMore = true
      this.error = null
      try {
        const nextPage = this.currentPage + 1
        const data = await searchBooks(this.buildQuery(), { limit: RESULTS_PER_PAGE, page: nextPage, sort: this.sortParam() })
        this.results = [...this.results, ...(data.docs || []).map(mapBook)]
        this.currentPage = nextPage
      } catch (err) {
        console.error('Erreur chargement supplémentaire :', err)
        this.error = 'Impossible de charger plus de résultats.'
      } finally {
        this.loadingMore = false
      }
    },

    // Remet tout l'état de recherche à zéro.
    reset() {
      this.query = ''
      this.results = []
      this.error = null
      this.total = 0
      this.currentPage = 1
      this.sort = 'relevance'
      this.minYear = ''
    }
  }
})
