import { defineStore } from 'pinia'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(pseudo, mdp) {
      try {
        // POST : /auth/login
        const { data } = await http.post(
          '/auth/login',
          { pseudo, mdp },
          { headers: { 'Content-Type': 'application/json' } },
        )
        this.token = data.jeton
        localStorage.setItem('token', data.jeton)

        // GET : /users/{id}
      } catch (e) {
        throw e
      }
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
