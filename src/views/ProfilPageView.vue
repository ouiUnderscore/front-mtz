<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <Header />

    <!-- Modale de confirmation suppression -->
    <div v-if="afficherModale" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        class="absolute inset-0 bg-black/70 backdrop-blur-sm"
        @click="afficherModale = false"
      ></div>
      <div
        class="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl shadow-black/60"
      >
        <div class="text-center mb-6">
          <span class="text-4xl">⚠️</span>
          <h2 class="text-white font-bold text-lg mt-3 mb-2">Supprimer le compte</h2>
          <p class="text-zinc-400 text-sm leading-relaxed">
            Cette action est irréversible. Votre compte et toutes vos données seront définitivement
            supprimés.
          </p>
        </div>
        <div
          v-if="erreurSuppression"
          class="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-red-400 text-base">⚠️</span>
          <p class="text-red-400 text-xs">{{ erreurSuppression }}</p>
        </div>
        <div class="flex flex-col gap-3">
          <button
            @click="supprimerCompte"
            :disabled="suppressionEnCours"
            class="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span v-if="suppressionEnCours" class="animate-spin text-base">⏳</span>
            <span>{{ suppressionEnCours ? 'Suppression...' : 'Confirmer la suppression' }}</span>
          </button>
          <button
            @click="afficherModale = false"
            :disabled="suppressionEnCours"
            class="w-full bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Modale détail réservation + avis -->
    <div v-if="resaSelectionnee" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="fermerResaModale"></div>
      <div
        class="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto"
      >
        <!-- Header modale -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-white font-bold text-lg">Détail de la réservation</h2>
            <p class="text-zinc-500 text-xs mt-1 uppercase tracking-widest">
              #{{ resaSelectionnee.id }}
            </p>
          </div>
          <button
            @click="fermerResaModale"
            class="text-zinc-500 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <!-- Infos réservation -->
        <div class="bg-zinc-800/50 rounded-lg p-4 space-y-3 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Description</span>
            <span class="text-zinc-100 text-right max-w-xs">{{
              resaSelectionnee.description
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Début</span>
            <span class="text-zinc-100">{{ resaSelectionnee.date_debut }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Fin</span>
            <span class="text-zinc-100">{{ resaSelectionnee.date_fin }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Statut</span>
            <span
              class="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800/40"
            >
              Active
            </span>
          </div>
        </div>

        <!-- Bouton annuler réservation -->
        <div class="mb-6">
          <button
            @click="annulerReservation(resaSelectionnee)"
            :disabled="annulationEnCours"
            class="w-full bg-transparent hover:bg-red-900/20 disabled:cursor-not-allowed text-red-500 hover:text-red-400 font-semibold uppercase tracking-widest text-xs py-2.5 px-5 rounded-lg border border-red-800/60 hover:border-red-600/60 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span v-if="annulationEnCours" class="animate-spin">⏳</span>
            <span>{{ annulationEnCours ? 'Annulation...' : 'Annuler la réservation' }}</span>
          </button>
          <div
            v-if="erreurAnnulation"
            class="mt-3 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
          >
            <span class="text-red-400">⚠️</span>
            <p class="text-red-400 text-xs">{{ erreurAnnulation }}</p>
          </div>
        </div>

        <!-- Avis existant -->
        <div v-if="avisExistant" class="mb-6">
          <h3 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-3">
            Votre avis
          </h3>
          <div class="bg-zinc-800/50 rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-1">
              <span
                v-for="i in 5"
                :key="i"
                class="text-lg"
                :class="i <= avisExistant.note ? 'text-yellow-400' : 'text-zinc-600'"
                >★</span
              >
              <span class="text-zinc-400 text-sm ml-2">{{ avisExistant.note }}/5</span>
            </div>
            <p class="text-zinc-300 text-sm">{{ avisExistant.commentaire }}</p>
          </div>
        </div>

        <!-- Formulaire avis -->
        <div v-else>
          <h3 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">
            Laisser un avis
          </h3>

          <div
            v-if="avisEnvoyé"
            class="bg-green-950/40 border border-green-800/40 rounded-lg px-4 py-3 text-green-400 text-sm text-center"
          >
            ✓ Merci pour votre avis !
          </div>

          <div v-else class="space-y-4">
            <!-- Note étoiles -->
            <div>
              <label class="text-zinc-400 text-xs uppercase tracking-widest mb-2 block">Note</label>
              <div class="flex items-center gap-1">
                <button
                  v-for="i in 5"
                  :key="i"
                  @click="noteAvis = i"
                  class="text-2xl transition-colors duration-150"
                  :class="i <= noteAvis ? 'text-yellow-400' : 'text-zinc-600 hover:text-yellow-300'"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Commentaire -->
            <div>
              <label class="text-zinc-400 text-xs uppercase tracking-widest mb-2 block"
                >Commentaire</label
              >
              <textarea
                v-model="commentaireAvis"
                rows="3"
                placeholder="Votre avis sur cette réservation..."
                class="w-full bg-zinc-800 border border-zinc-700 focus:border-red-600 text-zinc-100 text-sm rounded-lg px-4 py-3 outline-none resize-none placeholder-zinc-600 transition-colors duration-200"
              ></textarea>
            </div>

            <!-- Erreur avis -->
            <div
              v-if="erreurAvis"
              class="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
            >
              <span class="text-red-400 text-base">⚠️</span>
              <p class="text-red-400 text-xs">{{ erreurAvis }}</p>
            </div>

            <!-- Bouton soumettre -->
            <button
              @click="soumettreAvis"
              :disabled="envoiAvisEnCours || noteAvis === 0"
              class="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span v-if="envoiAvisEnCours" class="animate-spin text-base">⏳</span>
              <span>{{ envoiAvisEnCours ? 'Envoi...' : "Envoyer l'avis" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main v-if="user" class="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <!-- Bouton retour -->
      <button
        @click="retour"
        class="flex items-center gap-2 text-zinc-500 hover:text-white text-sm uppercase tracking-widest mb-10 transition-colors duration-200 w-fit"
      >
        <span>←</span>
        <span>Retour aux films</span>
      </button>

      <!-- Bannière -->
      <div
        class="relative mb-10 rounded-xl overflow-hidden h-36 bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 border border-red-900/30"
      >
        <div
          class="absolute inset-0 opacity-20"
          style="
            background-image: repeating-linear-gradient(
              45deg,
              #7f1d1d 0px,
              #7f1d1d 1px,
              transparent 1px,
              transparent 12px
            );
          "
        ></div>
        <div class="absolute bottom-4 left-6 flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-full bg-red-900/60 border-2 border-red-500/50 flex items-center justify-center text-2xl font-bold text-red-300"
          >
            {{ initiales }}
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-wide">{{ user.prenom }} {{ user.nom }}</h1>
            <p class="text-zinc-400 text-sm tracking-widest uppercase">{{ user.pseudo }}</p>
          </div>
        </div>
      </div>

      <!-- Infos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">
            Informations personnelles
          </h2>
          <div class="flex justify-between text-sm border-b border-zinc-800 pb-3">
            <span class="text-zinc-500">Prénom</span>
            <span class="text-zinc-100">{{ user.prenom }}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-zinc-800 pb-3">
            <span class="text-zinc-500">Nom</span>
            <span class="text-zinc-100">{{ user.nom }}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-zinc-800 pb-3">
            <span class="text-zinc-500">Pseudo</span>
            <span class="text-zinc-100">{{ user.pseudo }}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-zinc-800 pb-3">
            <span class="text-zinc-500">Âge</span>
            <span class="text-zinc-100">{{ user.age }} ans</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Adresse</span>
            <span class="text-zinc-100">{{ user.adresse }}</span>
          </div>
        </div>

        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">
            Compte & activité
          </h2>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Réservations</span>
            <span class="text-zinc-100">{{ reservations.length }}</span>
          </div>
        </div>
      </div>

      <!-- Réservations -->
      <div class="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">
          Mes réservations
        </h2>

        <div v-if="chargementReservations" class="text-zinc-500 text-sm text-center py-6">
          <span class="animate-spin inline-block mr-2">⏳</span> Chargement...
        </div>

        <p v-else-if="reservations.length === 0" class="text-zinc-500 text-sm text-center py-6">
          Aucune réservation pour le moment.
        </p>

        <div v-else class="divide-y divide-zinc-800">
          <div
            v-for="resa in reservations"
            :key="resa.id"
            @click="ouvrirResa(resa)"
            class="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-zinc-800/40 rounded-lg px-2 -mx-2 transition-colors duration-150"
          >
            <div>
              <p class="text-zinc-100 font-medium">{{ resa.description }}</p>
              <p class="text-zinc-500 text-xs mt-0.5">
                {{ resa.date_debut }} → {{ resa.date_fin }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800/40"
                >Active</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Zone danger -->
      <div class="mt-6 bg-zinc-900 border border-red-900/40 rounded-xl p-6">
        <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">
          Zone de danger
        </h2>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="text-zinc-200 text-sm font-medium">Supprimer mon compte</p>
            <p class="text-zinc-500 text-xs mt-1">
              Cette action est irréversible et supprime toutes vos données.
            </p>
          </div>
          <button
            @click="afficherModale = true"
            class="flex-shrink-0 bg-transparent hover:bg-red-900/30 text-red-500 hover:text-red-400 font-semibold uppercase tracking-widest text-xs py-2.5 px-5 rounded-lg border border-red-800/60 hover:border-red-600/60 transition-all duration-200"
          >
            Supprimer le compte
          </button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import http from '@/api/http'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const auth = useAuthStore()
const user = computed(() => auth.currentUser)
const router = useRouter()

// --- Suppression compte ---
const afficherModale = ref(false)
const suppressionEnCours = ref(false)
const erreurSuppression = ref('')

// --- Réservations ---
const reservations = ref([])
const chargementReservations = ref(false)

// --- Modale réservation ---
const resaSelectionnee = ref(null)
const avisExistant = ref(null)

// --- Annulation réservation ---
const annulationEnCours = ref(false)
const erreurAnnulation = ref('')

// --- Formulaire avis ---
const noteAvis = ref(0)
const commentaireAvis = ref('')
const envoiAvisEnCours = ref(false)
const erreurAvis = ref('')
const avisEnvoyé = ref(false)

const initiales = computed(() => {
  if (!user.value) return '?'
  return `${user.value.prenom?.[0] ?? ''}${user.value.nom?.[0] ?? ''}`.toUpperCase()
})

onMounted(async () => {
  if (!user.value?.id) return
  chargementReservations.value = true
  try {
    const { data } = await http.get('api/reservations')
    reservations.value = data.data.filter((r) => parseInt(r.userId) === parseInt(user.value.id))
  } catch (e) {
    console.error('Erreur chargement réservations', e)
  } finally {
    chargementReservations.value = false
  }
})

/**
 * @function ouvrirResa
 * @description Ouvre la modale de détail pour une réservation donnée.
 * Vérifie si un avis existe déjà via GET /api/reviews?idReservation={id}.
 * @param {Object} resa - L'objet réservation sélectionné
 */
async function ouvrirResa(resa) {
  resaSelectionnee.value = resa
  avisExistant.value = null
  noteAvis.value = 0
  commentaireAvis.value = ''
  erreurAvis.value = ''
  erreurAnnulation.value = ''
  avisEnvoyé.value = false

  try {
    const { data } = await http.get(`api/reviews?idReservation=${resa.id}`)
    avisExistant.value = data
  } catch {
    // 404 = aucun avis existant, comportement attendu
    avisExistant.value = null
  }
}

/**
 * @function fermerResaModale
 * @description Ferme la modale de détail et réinitialise l'état.
 */
function fermerResaModale() {
  resaSelectionnee.value = null
  avisExistant.value = null
  erreurAnnulation.value = ''
}

async function trouverFilmParIdInt(idInt) {
  const { data: films } = await http.get('api/films')
  return films.find((f) => parseInt(f.id.split('-')[0].substring(0, 4), 16) === idInt) ?? null
}

/**
 * @function annulerReservation
 * @description Annule une réservation et remet le film disponible.
 *
 * Étape 1 : DELETE /api/reservations/{id}       → supprime la réservation
 * Étape 2 : PATCH /api/films/{movieId}/open     → remet le film disponible
 * Étape 3 : Met à jour la liste locale et ferme la modale
 * @param {Object} resa - L'objet réservation à annuler
 */
async function annulerReservation(resa) {
  annulationEnCours.value = true
  erreurAnnulation.value = ''
  try {
    await http.delete(`api/reservations/${resa.id}`)
    const film = await trouverFilmParIdInt(parseInt(resa.movieId))
    if (film) {
      await http.patch('/api/films/' + film.id + '/open', {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Retirer la réservation de la liste locale
    reservations.value = reservations.value.filter((r) => r.id !== resa.id)
    fermerResaModale()
  } catch (e) {
    const status = e.response?.status
    if (status === 401) erreurAnnulation.value = 'Session expirée, veuillez vous reconnecter.'
    else if (status >= 500) erreurAnnulation.value = 'Erreur serveur, réessayez plus tard.'
    else erreurAnnulation.value = "Impossible d'annuler la réservation."
  } finally {
    annulationEnCours.value = false
  }
}

/**
 * @function soumettreAvis
 * @description Soumet un nouvel avis pour la réservation sélectionnée.
 *
 * Étape 1 : POST /api/reviews → crée l'avis avec { idReservation, note, commentaire }
 * Étape 2 : PATCH /api/reservations/{id} → met à jour l'evaluationId de la réservation
 *           avec l'id retourné par l'étape 1 (parseInt car evaluationId est un int côté Java)
 */
async function soumettreAvis() {
  if (noteAvis.value === 0) return
  envoiAvisEnCours.value = true
  erreurAvis.value = ''
  try {
    // Étape 1 — Créer l'avis (idReservation envoyé en String pour MongoDB)
    const { data: avis } = await http.post('api/reviews', {
      idReservation: String(resaSelectionnee.value.id),
      note: noteAvis.value,
      commentaire: commentaireAvis.value,
    })

    // Étape 2 — Patcher la réservation avec l'evaluationId de l'avis créé
    // await http.patch(`api/reservations/${resaSelectionnee.value.id}`, {
    //   id: parseInt(resaSelectionnee.value.id),
    //   description: resaSelectionnee.value.description,
    //   date_debut: resaSelectionnee.value.date_debut,
    //   date_fin: resaSelectionnee.value.date_fin,
    //   movieId: parseInt(resaSelectionnee.value.movieId),
    //   evaluationId: parseInt(avis.id.split('-')[0].substring(0, 4), 16), // UUID → int via première partie hex
    //   userId: parseInt(resaSelectionnee.value.userId),
    //   paiementId: parseInt(resaSelectionnee.value.paiementId),
    // })

    avisEnvoyé.value = true
  } catch (e) {
    const status = e.response?.status
    if (status === 400) {
      erreurAvis.value = 'Données invalides, vérifiez le formulaire'
    } else if (status >= 500) {
      erreurAvis.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurAvis.value = "Impossible d'envoyer l'avis"
    }
  } finally {
    envoiAvisEnCours.value = false
  }
}

/**
 * @function retour
 * @description Redirige l'utilisateur vers la liste des films.
 */
function retour() {
  router.push('/films')
}

/**
 * @function supprimerCompte
 * @description Supprime définitivement le compte de l'utilisateur connecté.
 *
 * Étape 1 : DELETE /api/users/{id}       → supprime les données utilisateur
 * Étape 2 : DELETE /auth/{pseudo}        → supprime les credentials d'auth
 * Étape 3 : Redirige vers /login et déconnecte le store
 */
async function supprimerCompte() {
  suppressionEnCours.value = true
  erreurSuppression.value = ''
  try {
    await http.delete(`/api/users/${user.value.id}`)
    await http.delete(`/auth/${user.value.pseudo}`)
    router.push('/login')
    auth.logout()
  } catch (e) {
    const status = e.response?.status
    if (status === 401) {
      erreurSuppression.value = 'Session expirée, veuillez vous reconnecter'
    } else if (status === 403) {
      erreurSuppression.value = "Vous n'êtes pas autorisé à effectuer cette action"
    } else if (status >= 500) {
      erreurSuppression.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurSuppression.value = 'Suppression impossible, vérifiez votre réseau'
    }
  } finally {
    suppressionEnCours.value = false
  }
}
</script>
