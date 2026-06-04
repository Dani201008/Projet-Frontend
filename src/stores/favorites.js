/**
 * Fichier  : src/stores/favorites.js
 * Auteur   : Samuel
 * Rôle     : Store Pinia pour les favoris, persistés côté backend (par utilisateur).
 * Créé le  : 01.06.2026
 * Modifié  : 01.06.2026
 */

import { defineStore } from 'pinia'
import api from '@/services/api.js'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    // Nombre de favoris (utilisé par le badge du header).
    count: (state) => state.items.length,
    // Vérifie si un livre donné est déjà dans les favoris.
    isFavorite: (state) => (id) => state.items.some(item => item.id === id)
  },

  actions: {
    /**
     * Charge tous les favoris de l'utilisateur connecté depuis le backend.
     * À appeler au login et à l'ouverture de la page Favoris.
     */
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/favorites')
        this.items = data.favorites
      } catch (err) {
        console.error('Erreur récupération favoris :', err)
        this.error = 'Impossible de charger les favoris.'
      } finally {
        this.loading = false
      }
    },

    /**
     * Ajoute un livre aux favoris de l'utilisateur connecté.
     */
    async add(book) {
      this.error = null
      try {
        await api.post('/favorites', book)
        if (!this.isFavorite(book.id)) {
          this.items.unshift(book)
        }
      } catch (err) {
        console.error('Erreur ajout favori :', err)
        this.error = err.response?.data?.error || 'Impossible d\'ajouter ce favori.'
      }
    },

    /**
     * Retire un livre des favoris de l'utilisateur connecté.
     */
    async remove(id) {
      this.error = null
      try {
        await api.delete(`/favorites/${id}`)
        this.items = this.items.filter(item => item.id !== id)
      } catch (err) {
        console.error('Erreur suppression favori :', err)
        this.error = err.response?.data?.error || 'Impossible de retirer ce favori.'
      }
    },

    /**
     * Bascule un livre : si déjà favori → on le retire, sinon → on l'ajoute.
     */
    async toggle(book) {
      if (this.isFavorite(book.id)) {
        await this.remove(book.id)
      } else {
        await this.add(book)
      }
    },

    /**
     * Vide la liste localement (appelée à la déconnexion).
     */
    clear() {
      this.items = []
      this.error = null
    }
  }
})
