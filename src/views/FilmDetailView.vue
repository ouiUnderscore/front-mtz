<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <Header />

    <div class="relative flex-1 flex flex-col px-6 py-12 max-w-3xl mx-auto w-full">
      <!-- Bouton retour -->
      <button
        @click="retour"
        class="flex items-center gap-2 text-zinc-500 hover:text-white text-sm uppercase tracking-widest mb-10 transition-colors duration-200 w-fit"
      >
        <span>←</span>
        <span>Retour aux films</span>
      </button>

      <div v-if="chargement" class="flex flex-col items-center justify-center flex-1 gap-3">
        <span class="animate-spin text-4xl">⏳</span>
        <p class="text-zinc-500 text-sm tracking-widest uppercase">Chargement du film...</p>
      </div>

      <div v-else-if="erreur" class="bg-red-950/50 border border-red-800/50 rounded-xl px-6 py-5 flex items-center gap-3">
        <span class="text-red-400 text-2xl">⚠️</span>
        <p class="text-red-400 text-sm">{{ erreur }}</p>
      </div>

      <div v-else-if="film" class="flex flex-col gap-8">
        <!-- En-tête : poster + titre -->
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <div class="w-full sm:w-48 h-64 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-center text-6xl flex-shrink-0 shadow-xl shadow-black/40">
            🎥
          </div>

          <div class="flex flex-col gap-3 flex-1">
            <h1 class="text-white font-black text-3xl tracking-wide leading-tight">{{ film.titre }}</h1>

            <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
              <span class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full">{{ film.anneeReal }}</span>
              <span class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full">{{ film.ageMin }}+</span>
              <span v-if="film.estDisponible" class="bg-green-900/40 border border-green-700/40 text-green-400 px-3 py-1 rounded-full">Disponible</span>
              <span v-else class="bg-zinc-800 border border-zinc-700 text-zinc-500 px-3 py-1 rounded-full">Indisponible</span>
            </div>

            <p class="text-zinc-400 text-sm leading-relaxed">{{ film.description }}</p>

            <div class="mt-auto pt-2 flex items-center justify-between">
              <span class="text-red-400 font-black text-2xl">{{ film.prix.toFixed(2) }} €</span>
              <button
                v-if="film.estDisponible"
                @click="modalOuverte = true"
                class="bg-red-600 hover:bg-red-500 text-white font-semibold uppercase tracking-widest text-xs px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>

        <div class="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        <!-- Informations complémentaires -->
        <div
          class="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/40"
        >
          <h2 class="text-white font-semibold text-sm uppercase tracking-widest mb-4">
            Informations
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-zinc-600 text-xs uppercase tracking-widest mb-1">
                Année de réalisation
              </p>
              <p class="text-zinc-200 text-sm font-medium">{{ film.anneeReal }}</p>
            </div>
            <div>
              <p class="text-zinc-600 text-xs uppercase tracking-widest mb-1">Âge minimum</p>
              <p class="text-zinc-200 text-sm font-medium">{{ film.ageMin }} ans</p>
            </div>
            <div>
              <p class="text-zinc-600 text-xs uppercase tracking-widest mb-1">Prix</p>
              <p class="text-zinc-200 text-sm font-medium">{{ film.prix.toFixed(2) }} €</p>
            </div>
            <div>
              <p class="text-zinc-600 text-xs uppercase tracking-widest mb-1">Disponibilité</p>
              <p
                class="text-sm font-medium"
                :class="film.estDisponible ? 'text-green-400' : 'text-zinc-500'"
              >
                {{ film.estDisponible ? 'Disponible' : 'Indisponible' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/api/http'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'

const film = ref(null)
const chargement = ref(false)
const erreur = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const modalOuverte = ref(false)
const erreurReservation = ref('')
const chargementReservation = ref(false)
const succes = ref(false)

async function chargerFilm() {
  chargement.value = true
  erreur.value = ''
  try {
    const response = await http.get(`/api/films/${route.params.id}`)
    film.value = response.data
  } catch (e) {
    const status = e.response?.status
    if (status === 401) {
      erreur.value = 'Session expirée, veuillez vous reconnecter'
      router.push('/login')
    } else if (status === 404) {
      erreur.value = 'Film introuvable'
    } else if (status >= 500) {
      erreur.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreur.value = 'Impossible de charger le film, vérifiez votre réseau'
    }
  } finally {
    chargement.value = false
  }
}

function fermerModal() {
  if (succes.value) return
  modalOuverte.value = false
  erreurReservation.value = ''
}

async function confirmerReservation() {
  erreurReservation.value = ''
  chargementReservation.value = true
  try {
    const dateDebut = new Date().toISOString().split('T')[0]
    const dateFin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    await http.post('/api/reservations', {
      id: null,
      description: `Location de "${film.value.titre}"`,
      date_debut: dateDebut,
      date_fin: dateFin,
      movieId: parseInt(film.value.id),
      evaluationId: 0,
      userId: auth.currentUser.id,
      paiementId: 1,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    succes.value = true
    setTimeout(() => {
      modalOuverte.value = false
      succes.value = false
    }, 2000)
  } catch (e) {
    console.log('data:', e.response?.data)
    const status = e.response?.status
    if (status >= 500) {
      erreurReservation.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurReservation.value = 'Réservation impossible, vérifiez votre réseau'
    }
  } finally {
    chargementReservation.value = false
  }
}

function retour() {
  router.push('/films')
}

onMounted(() => {
  chargerFilm()
})
</script>