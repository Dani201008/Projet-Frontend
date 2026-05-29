/**
 * Fichier  : src/stores/books.js
 * Auteur   : Dani
 * Rôle     : Store Pinia de la recherche (état partagé : requête, résultats, états).
 * Créé le  : 29.05.2026
 * Modifié  : 29.05.2026
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
    error: null,
    total: 0,
    // Critère de tri courant et année minimale : filtres appliqués côté client.
    sortBy: 'relevance',
    minYear: ''
  }),
  getters: {
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
      // Recherche vide : on remet l'état à zéro plutôt que d'appeler l'API pour rien.
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
