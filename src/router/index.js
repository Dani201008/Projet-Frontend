/**
 * Fichier  : src/router/index.js
 * Auteur   : Samuel
 * Rôle     : Routes Vue Router, titres d'onglet et garde d'authentification.
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Liste des routes (composants chargés en lazy).
// meta.title        : libellé repris dans le titre de l'onglet.
// meta.requiresAuth : page réservée aux utilisateurs connectés (sinon redirection vers /login).
// meta.guestOnly    : page réservée aux visiteurs non connectés (connexion, inscription).
//
// L'accueil, la recherche et la fiche détail restent accessibles sans compte :
// la connexion n'est demandée que pour les actions liées à un utilisateur (les favoris).
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
    // Fiche détaillée d'un livre. `props: true` passe le `:id` directement en prop.
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
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { title: 'Mot de passe oublié', guestOnly: true }
  },
  {
    // Route attrape-tout : toute URL non listée plus haut tombe ici.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page introuvable' }
  }
]

const router = createRouter({
  history: createWebHistory(), // URLs propres, sans le `#` du mode hash
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Garde globale : protège les pages « connecté seulement » et renvoie les
// utilisateurs déjà connectés hors des pages réservées aux visiteurs.
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

// Met à jour le titre de l'onglet après chaque navigation.
router.afterEach((to) => {
  const baseTitle = 'Media Explorer'
  document.title = to.meta.title ? `${to.meta.title} · ${baseTitle}` : baseTitle
})

export default router
