/*
|--------------------------------------------------------------------------
| Fichier  : src/stores/books.js
| Auteur   : Dani
| Rôle     : Store Pinia centralisant les recherches de livres.
|            Gère les résultats, les erreurs et les états de chargement.
| Créé le  : 27.05.2026
| Modifié  : 29.05.2026
|--------------------------------------------------------------------------
*/

import { defineStore } from 'pinia'
import { searchBooks } from '@/services/openLibrary.js'

/**
 * Nombre maximum de résultats demandés à l'API.
 * Utilisé pour limiter le volume affiché dans l'interface.
 */
const RESULTS_PER_PAGE = 24

/**
 * Transforme un document brut Open Library
 * en objet simplifié utilisable par les composants UI.
 *
 * @param {Object} doc - Livre brut retourné par l'API.
 * @returns {Object} Livre normalisé.
 */
function mapBook(doc) {
    return {

        // L'API retourne "/works/OL45W" ; on garde uniquement l'identifiant court.
        id: (doc.key || '').replace('/works/', ''),

        // Valeur de secours si aucun titre n'est disponible.
        title: doc.title || 'Titre inconnu',

        // Tableau des auteurs retournés par l'API.
        authors: doc.author_name || [],

        // null si l'année de publication est inconnue.
        year: doc.first_publish_year || null,

        // null si aucune couverture n'est disponible.
        coverId: doc.cover_i || null
    }
}

/**
 * Store principal des livres.
 * Centralise l'état afin qu'il puisse être partagé
 * entre plusieurs vues ou composants.
 */
export const useBooksStore = defineStore('books', {

    state: () => ({

        /**
         * Dernier terme effectivement recherché.
         * Utilisé pour conserver le contexte de recherche.
         */
        query: '',

        /** Tableau des livres normalisés. */
        results: [],

        /** true pendant toute la durée d'un appel API. */
        loading: false,

        /**
         * true pendant le chargement de résultats supplémentaires.
         * Utilisé pour le bouton "Charger plus".
         */
        loadingMore: false,

        /** Message d'erreur affichable dans l'interface. */
        error: null,

        /**
         * Nombre total de résultats côté serveur.
         * Peut dépasser results.length car les résultats sont paginés.
         */
        total: 0,

        /** Page actuellement chargée depuis l'API. */
        currentPage: 1,

        /**
         * Critère de tri sélectionné par l'utilisateur.
         * Valeurs possibles : relevance, title, year.
         */
        sortBy: 'relevance',

        /** Année minimale utilisée pour filtrer les résultats. */
        minYear: ''
    }),

    getters: {

        /**
         * Indique s'il reste encore des résultats à charger.
         * Compare le nombre actuel de résultats avec le total serveur.
         */
        hasMore: (state) => state.results.length < state.total,

        /**
         * Retourne les résultats filtrés et triés.
         */
        filteredResults: (state) => {

            let list = [...state.results]

            // Filtrage par année minimale.
            if (state.minYear) {
                const year = Number(state.minYear)
                list = list.filter(book => book.year && book.year >= year)
            }

            // Tri alphabétique par titre.
            if (state.sortBy === 'title') {
                list.sort((a, b) => a.title.localeCompare(b.title))

                // Tri décroissant par année.
            } else if (state.sortBy === 'year') {
                list.sort((a, b) => (b.year || 0) - (a.year || 0))
            }

            return list
        }
    },

    actions: {

        /**
         * Lance une recherche Open Library
         * et gère tous les états.
         *
         * @param {string} newQuery - Texte recherché par l'utilisateur.
         */
        async search(newQuery) {

            // Supprime les espaces inutiles.
            const trimmed = (newQuery || '').trim()

            /**
             * Si la recherche est vide :
             * - on réinitialise le store,
             * - on évite un appel API inutile.
             */
            if (!trimmed) {
                this.reset()
                return
            }

            // Active le spinner principal.
            this.loading = true

            // Réinitialise l'erreur précédente.
            this.error = null

            // Sauvegarde du terme recherché.
            this.query = trimmed

            // Retour à la première page.
            this.currentPage = 1

            try {

                /**
                 * Appel API Open Library.
                 * Résultats limités à 24 éléments.
                 */
                const data = await searchBooks(trimmed, {
                    limit: RESULTS_PER_PAGE,
                    page: 1
                })

                /**
                 * Normalisation des données API
                 * pour simplifier l'utilisation côté UI.
                 */
                this.results = (data.docs || []).map(mapBook)

                // Nombre total de résultats trouvés.
                this.total = data.numFound || 0

            } catch (err) {

                // Erreur complète visible dans la console.
                console.error('Erreur recherche :', err)

                /**
                 * Message utilisateur générique :
                 * aucun détail technique n'est affiché.
                 */
                this.error =
                    'Impossible de récupérer les résultats. Vérifiez votre connexion.'

                // Évite d'afficher d'anciens résultats.
                this.results = []

                // Réinitialise le compteur total.
                this.total = 0

            } finally {

                /**
                 * Exécuté dans tous les cas :
                 * succès, erreur ou exception.
                 */
                this.loading = false
            }
        },

        /**
         * Charge des résultats supplémentaires
         * depuis la page suivante.
         */
        async loadMore() {

            /**
             * Empêche :
             * - les doubles appels,
             * - les appels concurrents,
             * - les chargements inutiles.
             */
            if (this.loadingMore || this.loading || !this.hasMore) return

            // Active le spinner secondaire.
            this.loadingMore = true

            // Réinitialise l'erreur précédente.
            this.error = null

            try {

                // Calcul de la prochaine page.
                const nextPage = this.currentPage + 1

                /**
                 * Appel API pour récupérer
                 * les résultats suivants.
                 */
                const data = await searchBooks(this.query, {
                    limit: RESULTS_PER_PAGE,
                    page: nextPage
                })

                // Normalisation des nouveaux livres.
                const newBooks = (data.docs || []).map(mapBook)

                /**
                 * Ajoute les nouveaux résultats
                 * à ceux déjà affichés.
                 */
                this.results = [...this.results, ...newBooks]

                // Mise à jour de la page courante.
                this.currentPage = nextPage

            } catch (err) {

                // Erreur complète visible dans la console.
                console.error('Erreur chargement supplémentaire :', err)

                // Message affiché à l'utilisateur.
                this.error = 'Impossible de charger plus de résultats.'

            } finally {

                // Désactive le spinner secondaire.
                this.loadingMore = false
            }
        },

        /**
         * Réinitialise complètement le store.
         */
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