<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <Header />

    <!-- Modale réservation -->
    <div v-if="modalOuverte" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="fermerModal"></div>

      <div
        class="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl shadow-black/60"
      >
        <h2 class="text-white text-center font-bold text-lg mb-1">Nouvelle réservation</h2>
        <p class="text-zinc-500 text-center text-xs uppercase tracking-widest mb-6">
          {{ film?.titre }}
        </p>

        <!-- Succès -->
        <div
          v-if="succes"
          class="mb-4 bg-green-950/50 border border-green-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-green-400 text-base">✅</span>
          <p class="text-green-400 text-xs">Réservation confirmée !</p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <!-- Erreur -->
          <div
            v-if="erreurReservation"
            class="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
          >
            <span class="text-red-400">⚠️</span>
            <p class="text-red-400 text-xs">{{ erreurReservation }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-zinc-500 text-xs uppercase tracking-widest">Date début</label>
              <input
                v-model="form_reservation.date_debut"
                type="date"
                class="bg-zinc-800 border border-zinc-700 focus:border-red-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-zinc-500 text-xs uppercase tracking-widest">Date fin</label>
              <input
                v-model="form_reservation.date_fin"
                type="date"
                class="bg-zinc-800 border border-zinc-700 focus:border-red-500 text-white text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>
          <div class="flex flex-col gap-3 mt-2">
            <button
              @click="confirmerReservation"
              :disabled="chargementReservation"
              class="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span v-if="chargementReservation" class="animate-spin">⏳</span>
              <span>{{ chargementReservation ? 'Envoi...' : 'Confirmer la réservation' }}</span>
            </button>
            <button
              @click="fermerModal"
              :disabled="chargementReservation"
              class="w-full bg-transparent hover:bg-zinc-800 text-zinc-300 font-semibold uppercase tracking-widest text-sm py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>

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

      <div
        v-else-if="erreur"
        class="bg-red-950/50 border border-red-800/50 rounded-xl px-6 py-5 flex items-center gap-3"
      >
        <span class="text-red-400 text-2xl">⚠️</span>
        <p class="text-red-400 text-sm">{{ erreur }}</p>
      </div>

      <div v-else-if="film" class="flex flex-col gap-8">
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <div
            class="w-full sm:w-48 h-64 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-center text-6xl flex-shrink-0 shadow-xl shadow-black/40"
          >
            🎥
          </div>

          <div class="flex flex-col gap-3 flex-1">
            <h1 class="text-white font-black text-3xl tracking-wide leading-tight">
              {{ film.titre }}
            </h1>

            <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
              <span
                class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full"
                >{{ film.anneeReal }}</span
              >
              <span class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full"
                >{{ film.ageMin }}+</span
              >
              <span
                v-if="film.estDisponible"
                class="bg-green-900/40 border border-green-700/40 text-green-400 px-3 py-1 rounded-full"
                >Disponible</span
              >
              <span
                v-else
                class="bg-zinc-800 border border-zinc-700 text-zinc-500 px-3 py-1 rounded-full"
                >Indisponible</span
              >
            </div>

            <p class="text-zinc-400 text-sm leading-relaxed">{{ film.description }}</p>

            <div class="mt-auto pt-2 flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="text-red-400 font-black text-2xl">{{ film.prix.toFixed(2) }} €</span>
                <button
                  v-if="film.estDisponible"
                  @click="ouvrirModal"
                  class="bg-red-600 hover:bg-red-500 text-white font-semibold uppercase tracking-widest text-xs px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Réserver
                </button>
              </div>
              <!-- Message d'erreur d'accès -->
              <div
                v-if="erreurAcces"
                class="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
              >
                <span class="text-red-400">⚠️</span>
                <p class="text-red-400 text-xs">{{ erreurAcces }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
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

// formulaire de réservation init
const form_reservation = ref({
  id: 0,
  description: '',
  date_debut: '',
  date_fin: '',
  movieId: 0,
  evaluationId: 0,
  userId: 0,
  paiementId: 0,
})

// message d'erreur avant ouverture modale
const erreurAcces = ref('')

async function ouvrirModal() {
  erreurAcces.value = ''

  // rafraîchir l'utilisateur
  try {
    await auth.fetchUser(auth.currentUser.pseudo)
  } catch (e) {
    erreurAcces.value = 'Impossible de vérifier votre compte, réessayez.'
    return
  }

  const user = auth.currentUser

  // vérifier l'âge
  if (user.age < film.value.ageMin) {
    erreurAcces.value = `Vous devez avoir au moins ${film.value.ageMin} ans pour réserver ce film.`
    return
  }

  // vérifier que l'user a moins de 3 reservations
  try {
    // recup liste reservations
    const { data } = await http.get('api/reservations')
    // chercher les reservations de l'user
    const reservationsUser = data.data.filter((r) => parseInt(r.userId) === parseInt(user.id))
    // si il en a + de 3 erreur
    if (reservationsUser.length >= 3) {
      erreurAcces.value = 'Vous avez atteint le maximum de 3 réservations simultanées.'
      return
    }
  } catch (e) {
    erreurAcces.value = 'Impossible de vérifier vos réservations, réessayez.'
    return
  }

  // maj des champs du form
  form_reservation.value = {
    id: null,
    description: `Location de "${film.value?.titre}"`,
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    movieId: parseInt(film.value?.id.split('-')[0].substring(0, 4), 16),
    evaluationId: 0,
    userId: user.id,
    paiementId: 1,
  }

  erreurReservation.value = ''
  succes.value = false
  modalOuverte.value = true
}

function fermerModal() {
  if (chargementReservation.value) return
  modalOuverte.value = false
  erreurReservation.value = ''
  succes.value = false
}

async function confirmerReservation() {
  erreurReservation.value = ''

  // verifs dates
  const debut = new Date(form_reservation.value.date_debut)
  const fin = new Date(form_reservation.value.date_fin)
  const diffJours = (fin - debut) / (1000 * 60 * 60 * 24)

  if (!form_reservation.value.date_debut || !form_reservation.value.date_fin) {
    erreurReservation.value = 'Veuillez renseigner les deux dates.'
    return
  }
  if (fin <= debut) {
    erreurReservation.value = 'La date de fin doit être après la date de début.'
    return
  }
  if (diffJours > 7) {
    erreurReservation.value = 'La réservation ne peut pas dépasser 7 jours.'
    return
  }

  chargementReservation.value = true

  try {
    // ajout de la reservation
    await http.post(
      '/api/reservations',
      {
        ...form_reservation.value,
        // maj des champs date pour passer de yyyy-mm-dd à dd-mm-yyyy
        date_debut: form_reservation.value.date_debut.split('-').reverse().join('-'),
        date_fin: form_reservation.value.date_fin.split('-').reverse().join('-'),
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    // met le film à "non disponible"
    await http.patch('/api/films/' + film.value.id + '/close', {
      headers: { 'Content-Type': 'application/json' },
    })
    film.value.estDisponible = false
    succes.value = true
    setTimeout(() => fermerModal(), 2000)
  } catch (e) {
    const status = e.response?.status
    if (status === 401) erreurReservation.value = 'Session expirée, veuillez vous reconnecter.'
    else if (status >= 500) erreurReservation.value = 'Erreur serveur, réessayez plus tard.'
    else erreurReservation.value = 'Réservation impossible, vérifiez votre réseau.'
  } finally {
    chargementReservation.value = false
  }
}

// récupère et stocke film dans dans film.value
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

function retour() {
  router.push('/films')
}

onMounted(() => {
  chargerFilm()
})
</script>
