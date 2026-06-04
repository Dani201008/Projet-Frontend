/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Routes Vue Router, titres d'onglet et garde d'authentification.
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Liste des routes de l'application (composants chargés en lazy).
// meta.title        : libellé repris dans le titre de l'onglet du navigateur.
// meta.requiresAuth : page accessible seulement connecté (sinon redirection vers /login).
// meta.guestOnly    : page réservée aux visiteurs non connectés (connexion / inscription).
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Accueil', requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Recherche', requiresAuth: true }
  },
  {
    // Fiche détaillée d'un livre. `props: true` passe le `:id` de l'URL directement
    // en prop au composant, ce qui découple DetailView du routeur.
    path: '/book/:id',
    name: 'detail',
    component: () => import('@/views/DetailView.vue'),
    props: true,
    meta: { title: 'Détails du livre', requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { title: 'Mes favoris', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Connexion', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Inscription', guestOnly: true }
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

// Garde globale : bloque les pages protégées si on n'est pas connecté,
// et renvoie à l'accueil ceux qui sont déjà connectés mais visitent /login ou /register.
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

// Met à jour le titre de l'onglet après chaque navigation (« Page – Media Explorer »).
router.afterEach((to) => {
  const baseTitle = 'Media Explorer'
  document.title = to.meta.title ? `${to.meta.title} – ${baseTitle}` : baseTitle
})

export default router
