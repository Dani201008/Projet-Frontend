/*
|--------------------------------------------------------------------------
| Fichier  : src/stores/books.js
| Auteur   : Dani
| Rôle     : Store Pinia centralisant les recherches de livres. Gère les résultats, les erreurs et les états de chargement.
| Créé le  : 27.05.2026
Modifié le : 29.05.2026
|--------------------------------------------------------------------------
*/

import { defineStore } from 'pinia'
import { searchBooks } from '@/services/openLibrary.js'

/**
 * Nombre maximum de résultats demandés à l'API.
 * Permet de limiter le volume affiché dans l'interface.
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

        /** Message d'erreur affichable dans l'interface. */
        error: null,

        /**
         * Nombre total de résultats côté serveur.
         * Peut dépasser results.length car les résultats sont limités.
         */
        total: 0
    }),

    actions: {

        /**
         * Lance une recherche Open Library et gère tous les états.
         *
         * Séquence d'exécution :
         *   1. Nettoyage du terme utilisateur avec trim().
         *   2. Réinitialisation si la recherche est vide.
         *   3. Activation du chargement.
         *   4. Appel API et normalisation des données.
         *   5. Gestion des erreurs réseau/API.
         *   6. Désactivation du chargement dans finally.
         *
         * @param {string} newQuery - Texte recherché par l'utilisateur.
         */
        async search(newQuery) {

            // Supprime les espaces inutiles avant/après la saisie.
            const trimmed = (newQuery || '').trim()

            /**
             * Si le terme est vide après nettoyage :
             * - on vide les résultats,
             * - on évite un appel API inutile.
             */
            if (!trimmed) {
                this.query = ''
                this.results = []
                return
            }

            // Active le spinner de chargement.
            this.loading = true

            // Réinitialise l'éventuelle erreur précédente.
            this.error = null

            // Sauvegarde du terme actuellement recherché.
            this.query = trimmed

            try {

                /**
                 * Appel API Open Library.
                 * Les résultats sont volontairement limités à 24.
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

                // Nombre total de livres trouvés côté serveur.
                this.total = data.numFound || 0

            } catch (err) {

                // Erreur complète visible uniquement dans la console développeur.
                console.error('Erreur recherche :', err)

                /**
                 * Message utilisateur volontairement générique :
                 * on n'expose pas les détails techniques.
                 */
                this.error =
                    'Impossible de récupérer les résultats. Vérifiez votre connexion.'

                // Évite d'afficher d'anciens résultats après une erreur.
                this.results = []

                // Réinitialise également le compteur total.
                this.total = 0

            } finally {

                /**
                 * Exécuté dans tous les cas :
                 * succès, erreur ou exception.
                 *
                 * Garantit la disparition du spinner.
                 */
                this.loading = false
            }
        }
    }
})