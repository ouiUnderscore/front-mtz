import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Routes définies.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { // Redirection générale
      path: '/',
      redirect: () => {
        const auth = useAuthStore()
        return auth.isAuthenticated ? '/films' : '/login'
      },
    },
    { // Connexion
      path: '/login',
      component: () => import('@/views/LoginView.vue')
    },
    { // Ajout d'un utilisateur
      path: '/register',
      component: () => import('@/views/RegisterView.vue'),
    },
    { // Information de l'utilisateur connecté
      path: '/profil',
      component: () => import('@/views/ProfilPageView.vue'),
      meta: { requiresAuth: true },
    },
    { // Tous les films
      path: '/films',
      component: () => import('@/views/FilmsView.vue'),
      meta: { requiresAuth: true },
    },
    { // Ajout d'un film
      path: '/films/ajouter',
      component: () => import('@/views/AddFilmView.vue'),
      meta: { requiresAuth: true },
    },
    { // Information du film
      path: '/films/:id',
      component: () => import('@/views/FilmDetailView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

/**
 * Routes par défaut (vérification de l'authentification).
 */
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  if (to.path === '/login' && auth.isAuthenticated) {
    return '/films'
  }
})

export default router
