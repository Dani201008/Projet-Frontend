/**
 * Fichier  : src/services/api.js
 * Auteur   : Samuel
 * Rôle     : Client Axios pour notre backend Express (auth + favoris).
 * Créé le  : 01.06.2026
 * Modifié  : 01.06.2026
 */

import axios from 'axios'

// Clé localStorage où on stocke le JWT renvoyé par le backend.
const TOKEN_KEY = 'media-explorer:token'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000
})

// Intercepteur : ajoute le token JWT dans le header Authorization de chaque requête.
api.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepteur : si le serveur renvoie 401, on vide le token local
// pour forcer une nouvelle connexion la prochaine fois.
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY)
        }
        return Promise.reject(error)
    }
)

export default api
export { TOKEN_KEY }
