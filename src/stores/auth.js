/**
 * Fichier  : src/stores/auth.js
 * Auteur   : Samuel
 * Rôle     : Store Pinia pour l'authentification via l'API backend (bcrypt + JWT).
 * Créé le  : 29.05.2026
 * Modifié  : 04.06.2026
 */

import { defineStore } from 'pinia'
import api, { TOKEN_KEY } from '@/services/api.js'

// Clé localStorage pour persister l'utilisateur entre deux ouvertures de l'app.
const SESSION_KEY = 'media-explorer:current-user'

// Lit la dernière session connue depuis localStorage.
// Le JWT, lui, est stocké séparément sous TOKEN_KEY par api.js.
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // null = personne n'est connecté
    currentUser: loadSession(),
    // Message d'erreur à afficher dans les formulaires.
    error: null
  }),

  getters: {
    // Vrai si un utilisateur est connecté.
    isAuthenticated: (state) => state.currentUser !== null
  },

  actions: {
    /**
     * Inscrit un nouvel utilisateur via l'API et le connecte immédiatement.
     * Retourne true si l'inscription a réussi, false sinon.
     */
    async register(name, email, password) {
      this.error = null
      try {
        const { data } = await api.post('/auth/register', { name, email, password })
        this.setSession(data.token, data.user)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Impossible de créer le compte. Vérifiez que le serveur est démarré.'
        return false
      }
    },

    /**
     * Connecte un utilisateur via l'API si email + mot de passe sont valides.
     * Retourne true si la connexion a réussi, false sinon.
     */
    async login(email, password) {
      this.error = null
      try {
        const { data } = await api.post('/auth/login', { email, password })
        this.setSession(data.token, data.user)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Impossible de se connecter. Vérifiez que le serveur est démarré.'
        return false
      }
    },

    /**
     * Réinitialise le mot de passe via l'API puis connecte directement l'utilisateur.
     * Retourne true si la réinitialisation a réussi, false sinon.
     */
    async resetPassword(email, password) {
      this.error = null
      try {
        const { data } = await api.post('/auth/reset-password', { email, password })
        this.setSession(data.token, data.user)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Impossible de réinitialiser le mot de passe.'
        return false
      }
    },

    /**
     * Déconnecte l'utilisateur et nettoie la session locale.
     * Le JWT côté serveur reste valide jusqu'à son expiration (rien à révoquer).
     */
    logout() {
      this.currentUser = null
      this.error = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(SESSION_KEY)
    },

    /**
     * Vide le message d'erreur (appelé en arrivant sur un formulaire).
     */
    clearError() {
      this.error = null
    },

    /**
     * Enregistre le token JWT et les infos utilisateur après une connexion réussie.
     */
    setSession(token, user) {
      localStorage.setItem(TOKEN_KEY, token)
      this.currentUser = user
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    }
  }
})
