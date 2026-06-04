// Importation de Pinia pour créer un store global
import { defineStore } from 'pinia'

// Clé utilisée pour stocker les favoris dans le localStorage
const STORAGE_KEY = 'media-explorer:favorites'

/**
 * Charge les favoris enregistrés dans le localStorage.
 * Si aucune donnée n'existe ou qu'une erreur survient,
 * retourne un tableau vide.
 *
 * @returns {Array} Liste des favoris enregistrés
 */
function loadFromStorage() {
    try {
        // Récupération des données stockées
        const raw = localStorage.getItem(STORAGE_KEY)

        // Conversion du JSON en tableau JavaScript
        return raw ? JSON.parse(raw) : []

    } catch (err) {

        // Gestion des données corrompues ou invalides
        console.warn('Favoris illisibles, réinitialisation.', err)

        return []
    }
}

// Définition du store Pinia dédié à la gestion des favoris
export const useFavoritesStore = defineStore('favorites', {

    /**
     * État global du store.
     * Les favoris sont chargés automatiquement depuis le localStorage.
     */
    state: () => ({
        items: loadFromStorage()
    }),

    /**
     * Getters : données calculées à partir de l'état.
     */
    getters: {

        // Retourne le nombre total de favoris
        count: (state) => state.items.length,

        /**
         * Vérifie si un livre est déjà présent dans les favoris.
         *
         * @param {string} id Identifiant du livre
         * @returns {boolean}
         */
        isFavorite: (state) => (id) =>
            state.items.some(item => item.id === id)
    },

    /**
     * Actions : méthodes permettant de modifier les favoris.
     */
    actions: {

        /**
         * Ajoute un livre aux favoris
         * s'il n'est pas déjà présent.
         *
         * @param {Object} book Livre à ajouter
         */
        add(book) {
            if (!this.isFavorite(book.id)) {
                this.items.push(book)

                // Sauvegarde des modifications
                this.persist()
            }
        },

        /**
         * Supprime un livre des favoris à partir de son identifiant.
         *
         * @param {string} id Identifiant du livre
         */
        remove(id) {

            // Création d'une nouvelle liste sans le livre supprimé
            this.items = this.items.filter(item => item.id !== id)

            // Sauvegarde des modifications
            this.persist()
        },

        /**
         * Ajoute ou retire un livre des favoris
         * selon son état actuel.
         *
         * @param {Object} book Livre concerné
         */
        toggle(book) {

            if (this.isFavorite(book.id)) {

                // Retrait si déjà favori
                this.remove(book.id)

            } else {

                // Ajout sinon
                this.add(book)
            }
        },

        /**
         * Enregistre la liste actuelle des favoris
         * dans le localStorage.
         */
        persist() {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(this.items)
            )
        }
    }
})