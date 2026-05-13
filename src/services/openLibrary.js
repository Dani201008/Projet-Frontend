/**
 * Fichier  : src/services/openLibrary.js
 * Auteur   : Dani
 * Rôle     : Client Axios pour l'API OpenLibrary.
 * Créé le  : 08.05.2026
 * Modifié  : 08.05.2026
 */

import axios from 'axios'

// Une seule instance Axios partagée pour tous les appels à OpenLibrary.
// Comme ça, on n'écrit pas l'URL de base dans chaque fonction.
const http = axios.create({
    baseURL: 'https://openlibrary.org',
    timeout: 10000 // 10 s max : au-delà, on abandonne pour ne pas faire attendre l'utilisateur indéfiniment
})

// Les couvertures sont servies sur un autre domaine que l'API.
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b'

/**
 * Cherche des livres qui correspondent à `query` (titre, auteur, sujet…).
 * Renvoie la réponse brute d'OpenLibrary : {docs: [...], numFound: ...}.
 *
 * @param {string} query  - Termes de recherche tapés par l'utilisateur.
 * @param {object} [opts] - Options de pagination (limit = livres par page, page = numéro de page).
 */
export async function searchBooks(query, { limit = 24, page = 1 } = {}) {
    const response = await http.get('/search.json', {
        params: { q: query, limit, page }
    })
    return response.data
}

/**
 * Construit l'URL d'une couverture à partir de son ID OpenLibrary.
 * Renvoie null s'il n'y a pas d'ID — utile pour afficher un placeholder côté UI.
 *
 * Tailles disponibles : 'S' (small ~75 px), 'M' (medium ~180 px), 'L' (large ~500 px).
 */
export function getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`
}