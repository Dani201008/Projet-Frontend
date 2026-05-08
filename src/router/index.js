/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Configuration des routes Vue Router.
 * Créé le  : 08.05.2026
 * Modifié  : 08.05.2026
 */

import { createRouter, createWebHistory } from 'vue-router'

// Liste des routes de l'application.
// Les composants sont chargés en lazy (via `() => import(...)`) :
// le code de chaque page n'est téléchargé que quand on y va, ça accélère le premier chargement.
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue')
  },
  {
    // Route attrape-tout : toute URL non listée plus haut tombe ici.
    // Doit rester en dernier sinon elle masquerait les autres.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(), // URLs propres, sans le `#` du mode hash
  routes,
  // Quand on change de page, on remonte tout en haut.
  // C'est ce que l'utilisateur attend après un clic sur un lien.
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router