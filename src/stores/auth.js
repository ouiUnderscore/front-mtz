import { defineStore } from 'pinia'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
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

        // GET : /users → find by pseudo
        await this.fetchUser(pseudo)
      } catch (e) {
        throw e
      }
    },

    async fetchUser(pseudo) {
      try {
        const { data } = await http.get('api/users')
        const found = data.find((u) => u.pseudo === pseudo)

        if (!found) throw new Error('Utilisateur introuvable')

        this.user = {
          id: found.id,
          pseudo: found.pseudo,
          nom: found.nom,
          prenom: found.prenom,
          adresse: found.adresse,
          age: found.age,
          statut: found.statut,        // true/false → peut servir de "rôle actif"
          idReservations: found.idReservations,
        }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (e) {
        throw e
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
})