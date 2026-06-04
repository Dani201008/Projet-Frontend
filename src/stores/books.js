// Importation de Pinia pour créer un store global
import { defineStore } from 'pinia'

// Importation du service permettant d'effectuer des recherches via l'API Open Library
import { searchBooks } from '@/services/openLibrary.js'

// Nombre de résultats récupérés par page
const RESULTS_PER_PAGE = 24

/**
 * Transforme les données brutes retournées par l'API
 * en un format simplifié utilisé dans l'application.
 */
function mapBook(doc) {
    return {
        // Identifiant unique du livre
        id: (doc.key || '').replace('/works/', ''),

        // Titre du livre ou valeur par défaut si absent
        title: doc.title || 'Titre inconnu',

        // Liste des auteurs
        authors: doc.author_name || [],

        // Année de première publication
        year: doc.first_publish_year || null,

        // Identifiant de la couverture du livre
        coverId: doc.cover_i || null
    }
}

// Définition du store Pinia dédié à la gestion des livres
export const useBooksStore = defineStore('books', {

    /**
     * État global du store
     */
    state: () => ({
        query: '',            // Texte de recherche saisi par l'utilisateur
        results: [],          // Liste des livres récupérés
        loading: false,       // Indique si une recherche est en cours
        loadingMore: false,   // Indique si un chargement supplémentaire est en cours
        error: null,          // Message d'erreur éventuel
        total: 0,             // Nombre total de résultats trouvés
        currentPage: 1,       // Page actuellement chargée
        sortBy: 'relevance',  // Critère de tri sélectionné
        minYear: ''           // Année minimale pour le filtrage
    }),

    /**
     * Getters : données calculées à partir de l'état
     */
    getters: {

        // Vérifie s'il reste des résultats à charger
        hasMore: (state) => state.results.length < state.total,

        // Retourne les résultats filtrés et triés
        filteredResults: (state) => {
            let list = [...state.results]

            // Filtrage par année minimale
            if (state.minYear) {
                const year = Number(state.minYear)
                list = list.filter(book => book.year && book.year >= year)
            }

            // Tri alphabétique par titre
            if (state.sortBy === 'title') {
                list.sort((a, b) => a.title.localeCompare(b.title))

                // Tri décroissant par année de publication
            } else if (state.sortBy === 'year') {
                list.sort((a, b) => (b.year || 0) - (a.year || 0))
            }

            return list
        }
    },

    /**
     * Actions : méthodes permettant de modifier l'état
     */
    actions: {

        /**
         * Effectue une nouvelle recherche de livres.
         * @param {string} newQuery Texte saisi par l'utilisateur
         */
        async search(newQuery) {

            // Suppression des espaces inutiles
            const trimmed = (newQuery || '').trim()

            // Si la recherche est vide, on réinitialise le store
            if (!trimmed) {
                this.reset()
                return
            }

            // Initialisation de l'état de chargement
            this.loading = true
            this.error = null
            this.query = trimmed
            this.currentPage = 1

            try {
                // Appel à l'API Open Library
                const data = await searchBooks(trimmed, {
                    limit: RESULTS_PER_PAGE,
                    page: 1
                })

                // Conversion des données reçues
                this.results = (data.docs || []).map(mapBook)

                // Nombre total de résultats disponibles
                this.total = data.numFound || 0

            } catch (err) {

                // Gestion des erreurs réseau ou API
                console.error('Erreur recherche :', err)

                this.error =
                    'Impossible de récupérer les résultats. Vérifiez votre connexion.'

                this.results = []
                this.total = 0

            } finally {

                // Fin du chargement
                this.loading = false
            }
        },

        /**
         * Charge la page suivante de résultats.
         * Utilisé pour le bouton "Voir plus".
         */
        async loadMore() {

            // Empêche les chargements simultanés ou inutiles
            if (this.loadingMore || this.loading || !this.hasMore) return

            this.loadingMore = true
            this.error = null

            try {
                // Calcul de la prochaine page
                const nextPage = this.currentPage + 1

                // Récupération des nouveaux résultats
                const data = await searchBooks(this.query, {
                    limit: RESULTS_PER_PAGE,
                    page: nextPage
                })

                // Conversion des nouvelles données
                const newBooks = (data.docs || []).map(mapBook)

                // Ajout des nouveaux livres à la liste existante
                this.results = [...this.results, ...newBooks]

                // Mise à jour du numéro de page
                this.currentPage = nextPage

            } catch (err) {

                // Gestion des erreurs de chargement
                console.error('Erreur chargement supplémentaire :', err)

                this.error =
                    'Impossible de charger plus de résultats.'

            } finally {

                // Fin du chargement supplémentaire
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