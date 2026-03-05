import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/films',
      component: () => import('@/views/FilmsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/films/ajouter',
      component: () => import('@/views/AddFilmView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/films/:id',
      component: () => import('@/views/FilmDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profil',
      component: () => import('@/views/ProfilPageView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: () => {
        const auth = useAuthStore()
        return auth.isAuthenticated ? '/films' : '/login'
      },
    },
    {
      path: '/register',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
})

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
