/**
 * Fichier  : src/stores/history.js
 * Auteur   : Timmy
 * Rôle     : Historique « Vus récemment », conservé dans le localStorage du navigateur.
 * Créé le  : 04.06.2026
 * Modifié  : 04.06.2026
 */

import { defineStore } from 'pinia'

const STORAGE_KEY = 'media-explorer:history'
const MAX_ITEMS = 8

// Relit l'historique au démarrage. En cas de données corrompues, on repart d'une liste vide.
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Historique illisible, réinitialisation.', err)
    return []
  }
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    items: loadFromStorage()
  }),
  actions: {
    /**
     * Ajoute un livre en tête de l'historique (sans doublon) et garde les plus récents.
     */
    add(book) {
      this.items = [book, ...this.items.filter(item => item.id !== book.id)].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },
    clear() {
      this.items = []
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
