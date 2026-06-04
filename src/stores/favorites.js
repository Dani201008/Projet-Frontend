/**
 * Fichier  : src/stores/favorites.js
 * Auteur   : Dani
 * Rôle     : Store Pinia des favoris, persistés dans le localStorage du navigateur.
 * Créé le  : 04.06.2026
 * Modifié  : 04.06.2026
 */

import { defineStore } from 'pinia'

const STORAGE_KEY = 'media-explorer:favorites'

// Relit les favoris stockés au démarrage. En cas de données corrompues,
// on repart sur une liste vide plutôt que de planter l'application.
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Favoris illisibles, réinitialisation.', err)
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: loadFromStorage()
  }),
  getters: {
    count: (state) => state.items.length,
    // Renvoie une fonction : permet d'écrire isFavorite(id) dans les composants.
    isFavorite: (state) => (id) => state.items.some(item => item.id === id)
  },
  actions: {
    add(book) {
      if (!this.isFavorite(book.id)) {
        this.items.push(book)
        this.persist()
      }
    },
    remove(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.persist()
    },
    toggle(book) {
      if (this.isFavorite(book.id)) {
        this.remove(book.id)
      } else {
        this.add(book)
      }
    },
    // Recopie la liste dans le localStorage après chaque changement.
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    }
  }
})
