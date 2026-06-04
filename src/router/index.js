/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Configuration des routes de l'application Vue Router.
 *            Définit la navigation entre les différentes pages.
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

// Import de Vue Router
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Définition des routes de l'application
 * Chaque route associe un chemin URL à une vue
 */
const routes = [

    // Page d'accueil
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue')
    },

    // Page de recherche de livres
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/SearchView.vue')
    },

    // Page de détail d'un livre
    // ":id" est un paramètre dynamique
    {
        path: '/book/:id',
        name: 'detail',
        component: () => import('@/views/DetailView.vue'),
        props: true // permet de passer l'id comme prop au composant
    },

    // Page des favoris
    {
        path: '/favorites',
        name: 'favorites',
        component: () => import('@/views/FavoritesView.vue')
    },

    // Route "catch-all" pour les pages inexistantes (404)
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue')
    }
]

/**
 * Création du router Vue
 * - history: mode HTML5 (URLs propres sans #)
 * - routes: liste des routes définies ci-dessus
 */
const router = createRouter({
    history: createWebHistory(),
    routes,

    /**
     * Permet de revenir en haut de page
     * lors d'un changement de route
     */
    scrollBehavior() {
        return { top: 0 }
    }
})

// Export du router pour l'utiliser dans l'application
export default router
