import { defineStore } from 'pinia'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(pseudo, mdp) {
      try {
        const { data } = await http.post(
          '/auth/login',
          { pseudo, mdp },
          { headers: { 'Content-Type': 'application/json' } },
        )
        console.log('Réponse login:', data)
        this.token = data.jeton
        localStorage.setItem('token', data.jeton)
      } catch (e) {
        console.log('Erreur status:', e.response?.status)
        console.log('Erreur data:', e.response?.data)
        console.log('Erreur complète:', e)
        throw e // ← AJOUTER CETTE LIGNE pour que handleLogin reçoive l'erreur
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
