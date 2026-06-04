/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Configuration des routes Vue Router (+ titre d'onglet par page).
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

import { createRouter, createWebHistory } from 'vue-router'

// Liste des routes de l'application.
// Les composants sont chargés en lazy (via `() => import(...)`) :
// le code de chaque page n'est téléchargé que quand on y va, ça accélère le premier chargement.
// meta.title : libellé repris dans le titre de l'onglet du navigateur.
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Accueil' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Recherche' }
  },
  {
    // Fiche détaillée d'un livre. `props: true` passe le `:id` de l'URL directement
    // en prop au composant, ce qui découple DetailView du routeur.
    path: '/book/:id',
    name: 'detail',
    component: () => import('@/views/DetailView.vue'),
    props: true,
    meta: { title: 'Détails du livre' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { title: 'Mes favoris' }
  },
  {
    // Route attrape-tout : toute URL non listée plus haut tombe ici.
    // Doit rester en dernier sinon elle masquerait les autres.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page introuvable' }
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

// Met à jour le titre de l'onglet après chaque navigation (« Page – Media Explorer »).
router.afterEach((to) => {
  const baseTitle = 'Media Explorer'
  document.title = to.meta.title ? `${to.meta.title} – ${baseTitle}` : baseTitle
})

export default router
