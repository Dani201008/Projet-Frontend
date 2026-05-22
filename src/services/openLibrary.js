/**
 * Fichier  : src/services/openLibrary.js
 * Auteur   : Dani
 * Rôle     : Client Axios pour l'API OpenLibrary (recherche, détails, auteurs, couvertures).
 * Créé le  : 08.05.2026
 * Modifié  : 22.05.2026
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
 * Renvoie la réponse brute d'OpenLibrary : { docs: [...], numFound: ... }.
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
 * Récupère les détails d'une œuvre (livre).
 * OpenLibrary appelle un livre une "work" — d'où l'endpoint /works/.
 *
 * @param {string} workId - Identifiant de l'œuvre, ex. "OL45804W" (extrait de doc.key).
 * @returns {Promise<object>} Données brutes : titre, description, sujets, couvertures, auteurs (en référence).
 */
export async function getWorkDetails(workId) {
    const response = await http.get(`/works/${workId}.json`)
    return response.data
}

/**
 * Récupère les infos d'un auteur (notamment son nom).
 * Nécessaire car /works/ ne renvoie que des références (`/authors/OLxxxA`) et
 * pas les noms directement. Une 2e requête par auteur est donc indispensable.
 *
 * @param {string} authorKey - Identifiant de l'auteur, ex. "OL23919A".
 */
export async function getAuthor(authorKey) {
    const response = await http.get(`/authors/${authorKey}.json`)
    return response.data
}

/**
 * Construit l'URL d'une couverture à partir de son ID OpenLibrary.
 * Renvoie null s'il n'y a pas d'ID - utile pour afficher un placeholder côté UI.
 *
 * Tailles disponibles : 'S' (small ~75 px), 'M' (medium ~180 px), 'L' (large ~500 px).
 */
export function getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`
}
