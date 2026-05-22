/**
 * Fichier  : src/services/openLibrary.js
 * Auteur   : Dani
 * Rôle     : Client Axios pour l'API OpenLibrary (recherche, détails, auteurs, couvertures).
 * Créé le  : 08.05.2026
 * Modifié  : 22.05.2026
 */

import axios from 'axios'

// Instance Axios partagée, pour éviter de répéter l'URL de base partout.
const http = axios.create({
    baseURL: 'https://openlibrary.org',
    timeout: 10000 // 10 s max, après on laisse tomber
})

// Les couvertures sont sur un autre domaine.
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b'

/**
 * Recherche de livres par titre, auteur, sujet, etc.
 * Renvoie la réponse brute : { docs: [...], numFound: ... }.
 */
export async function searchBooks(query, { limit = 24, page = 1 } = {}) {
    const response = await http.get('/search.json', {
        params: { q: query, limit, page }
    })
    return response.data
}

/**
 * Détails d'un livre (appelé "work" chez OpenLibrary).
 * @param {string} workId - ex: "OL45804W"
 */
export async function getWorkDetails(workId) {
    const response = await http.get(`/works/${workId}.json`)
    return response.data
}

/**
 * Infos d'un auteur (surtout pour récupérer son nom).
 * /works/ ne renvoie que des références d'auteurs, donc il faut un appel en plus.
 */
export async function getAuthor(authorKey) {
    const response = await http.get(`/authors/${authorKey}.json`)
    return response.data
}

/**
 * Construit l'URL d'une couverture à partir de son ID.
 * Renvoie null s'il n'y a pas d'ID (pour afficher un placeholder côté UI).
 * Tailles : 'S', 'M' ou 'L'.
 */
export function getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`
}
