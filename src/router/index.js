/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Configuration des routes Vue Router.
 * Créé le  : 08.05.2026
 * Modifié  : 20.05.2026
 */

import { createRouter, createWebHistory } from 'vue-router'

/**
 * Définition des routes de l'application.
 * Chaque composant est chargé en lazy-loading via import() dynamique :
 * Vite ne bundle pas ces vues dans le fichier principal mais crée un
 * chunk séparé chargé uniquement quand l'utilisateur visite la route.
 * Résultat : le premier chargement de l'app est plus rapide.
 */
const routes = [
    {
        path: '/',
        name: 'home',
        // Page d'accueil — point d'entrée de l'application.
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/search',
        name: 'search',
        // Page de recherche avec gestion des états (spinner, erreur, vide, résultats).
        // Le paramètre ?q= est lu directement depuis $route.query dans SearchView.
        component: () => import('@/views/SearchView.vue')
    },
    {
        path: '/book/:id',
        name: 'detail',
        // Page de détail d'un livre. :id correspond à l'identifiant Open Library
        // (ex. : 'OL45W'), extrait de doc.key dans les résultats de recherche.
        // props: true injecte :id comme prop du composant plutôt que de forcer
        // DetailView à lire $route.params.id lui-même — le composant reste testable
        // indépendamment du routeur.
        component: () => import('@/views/DetailView.vue'),
        props: true
    },
    {
        // Wildcard : capture toute URL non reconnue par les routes précédentes.
        // /:pathMatch(.*)* est la syntaxe Vue Router 4 pour "tout ce qui reste",
        // y compris les chemins avec plusieurs segments (ex. : /foo/bar/baz).
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue')
    }
]

/**
 * Instance du routeur, exportée et enregistrée dans main.js via app.use(router).
 *
 * - createWebHistory() : utilise l'API History du navigateur (URLs propres
 *   sans #). Requiert que le serveur redirige toutes les URLs vers index.html
 *   pour que Vue Router prenne la main (configuration Nginx / Vite preview).
 *   Alternativement, createWebHashHistory() évite cette contrainte serveur
 *   mais produit des URLs avec # (moins propres, moins SEO-friendly).
 *
 * - scrollBehavior() : repositionne systématiquement la page en haut lors
 *   de chaque navigation. Sans ça, Vue Router conserve la position de scroll
 *   précédente, ce qui peut désorienner l'utilisateur sur la nouvelle page.
 *   Retourner { top: 0 } est l'équivalent de window.scrollTo(0, 0).
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router