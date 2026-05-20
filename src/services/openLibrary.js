/**
 * Fichier  : src/services/openLibrary.js
 * Auteur   : Dani
 * Rôle     : Client Axios pour l'API OpenLibrary.
 * Créé le  : 08.05.2026
 * Modifié  : 20.05.2026
 */

/**
 * Fichier  : src/services/openLibrary.js
 * Rôle     : Couche d'accès à l'API Open Library et à son CDN de couvertures.
 *
 * Deux origines distinctes sont utilisées :
 *   - https://openlibrary.org  → données JSON (recherche, œuvres, auteurs)
 *   - https://covers.openlibrary.org → images de couvertures (CDN statique)
 *
 * Toutes les fonctions sont async et laissent remonter les erreurs réseau
 * à l'appelant (SearchView, BookDetailView…) qui affiche l'encart ErrorMessage.
 */

import axios from 'axios'

/**
 * Instance Axios partagée pour tous les appels à l'API Open Library.
 *
 * - baseURL : évite de répéter le domaine dans chaque appel et centralise
 *   un éventuel changement d'environnement (staging, mock…).
 * - timeout : abandonne la requête après 10 s pour ne pas laisser
 *   l'utilisateur face à un spinner infini si le serveur ne répond pas.
 *   L'erreur est alors propagée comme n'importe quelle erreur réseau.
 */
const http = axios.create({
    baseURL: 'https://openlibrary.org',
    timeout: 10000
})

/**
 * URL de base du CDN Open Library pour les couvertures de livres.
 * Format final d'une image : {COVERS_BASE_URL}/id/{coverId}-{size}.jpg
 * Tailles disponibles : 'S' (petite), 'M' (moyenne), 'L' (grande).
 */
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b'

/**
 * Recherche des livres correspondant à un terme donné.
 *
 * Endpoint : GET /search.json
 * Doc      : https://openlibrary.org/dev/docs/api#anchor_searchapi
 *
 * @param {string} query          - Terme de recherche (titre, auteur, sujet…).
 * @param {object} [options]      - Options de pagination.
 * @param {number} [options.limit=24] - Nombre de résultats par page.
 * @param {number} [options.page=1]   - Numéro de page (commence à 1).
 * @returns {Promise<object>} Objet brut retourné par l'API :
 *   { numFound, start, docs: [...] }
 *   Le mapping vers le modèle interne est fait côté appelant (SearchView).
 */
export async function searchBooks(query, { limit = 24, page = 1 } = {}) {
    const response = await http.get('/search.json', {
        params: { q: query, limit, page }
    })
    return response.data
}

/**
 * Récupère le détail complet d'une œuvre (description, sujets, couvertures…).
 *
 * Endpoint : GET /works/{workId}.json
 * Doc      : https://openlibrary.org/dev/docs/api#anchor_worksapi
 *
 * @param {string} workId - Identifiant court de l'œuvre, sans préfixe
 *   (ex. : 'OL45W', pas '/works/OL45W').
 *   SearchView extrait cet identifiant en retirant '/works/' de doc.key.
 * @returns {Promise<object>} Données brutes de l'œuvre.
 */
export async function getWorkDetails(workId) {
    const response = await http.get(`/works/${workId}.json`)
    return response.data
}

/**
 * Récupère le profil d'un auteur (nom, bio, photo…).
 *
 * Endpoint : GET /authors/{authorKey}.json
 * Doc      : https://openlibrary.org/dev/docs/api#anchor_authorsapi
 *
 * @param {string} authorKey - Clé de l'auteur telle que retournée par l'API
 *   (ex. : 'OL23919A'). Peut être extraite de doc.author_key dans les
 *   résultats de recherche.
 * @returns {Promise<object>} Données brutes de l'auteur.
 */
export async function getAuthor(authorKey) {
    const response = await http.get(`/authors/${authorKey}.json`)
    return response.data
}

/**
 * Construit l'URL d'une image de couverture à partir de son identifiant CDN.
 *
 * Cette fonction est synchrone et ne fait aucun appel réseau : elle
 * assemble simplement une URL selon le format du CDN Open Library.
 *
 * @param {number|null} coverId - Identifiant numérique de la couverture,
 *   issu du champ `cover_i` des résultats de recherche.
 *   Si null ou falsy (couverture absente), retourne null — c'est au
 *   composant appelant (BookCard…) d'afficher un placeholder.
 * @param {'S'|'M'|'L'} [size='M'] - Taille souhaitée :
 *   S ≈ 55×70 px, M ≈ 180×270 px, L ≈ 500×750 px.
 * @returns {string|null} URL complète de l'image, ou null si coverId est absent.
 *
 * @example
 * getCoverUrl(12345)      // → 'https://covers.openlibrary.org/b/id/12345-M.jpg'
 * getCoverUrl(12345, 'L') // → 'https://covers.openlibrary.org/b/id/12345-L.jpg'
 * getCoverUrl(null)       // → null
 */
export function getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`
}