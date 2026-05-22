/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Configuration des routes Vue Router.
 * Créé le  : 08.05.2026
 * Modifié  : 22.05.2026
 */

import { createRouter, createWebHistory } from 'vue-router'

// Les vues sont chargées en lazy-loading pour accélérer le premier chargement.
const routes = [
    {
        path: '/',
        name: 'home',
        // Page d'accueil.
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/search',
        name: 'search',
        // Page de recherche. Le ?q= est lu dans SearchView via $route.query.
        component: () => import('@/views/SearchView.vue')
    },
    {
        path: '/book/:id',
        name: 'detail',
        // Page de détail d'un livre. L'id vient d'Open Library (ex: 'OL45W').
        // props: true injecte l'id en prop plutôt que via $route.
        component: () => import('@/views/DetailView.vue'),
        props: true
    },
    {
        // Page 404 : attrape toutes les URLs non reconnues.
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue')
    }
]

// Routeur principal de l'app, branché dans main.js via app.use(router).
// scrollBehavior : on remet le scroll en haut à chaque changement de page.
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
