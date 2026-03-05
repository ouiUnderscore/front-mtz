<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <Header />

    <!-- Modale de confirmation suppression -->
    <div v-if="afficherModale" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/70 backdrop-blur-sm"
        @click="afficherModale = false"
      ></div>

      <!-- Contenu modale -->
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

        <!-- Erreur -->
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

        <!-- Chargement -->
        <div v-if="chargementReservations" class="text-zinc-500 text-sm text-center py-6">
          <span class="animate-spin inline-block mr-2">⏳</span> Chargement...
        </div>

        <!-- Vide -->
        <p v-else-if="reservations.length === 0" class="text-zinc-500 text-sm text-center py-6">
          Aucune réservation pour le moment.
        </p>

        <!-- Liste -->
        <div v-else class="divide-y divide-zinc-800">
          <div
            v-for="resa in reservations"
            :key="resa.id"
            class="flex items-center justify-between py-3 text-sm"
          >
            <div>
              <p class="text-zinc-100 font-medium">{{ resa.description }}</p>
              <p class="text-zinc-500 text-xs mt-0.5">{{ resa.date_debut }} → {{ resa.date_fin }}</p>
            </div>
            <span class="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800/40">
              Active
            </span>
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

const afficherModale = ref(false)
const suppressionEnCours = ref(false)
const erreurSuppression = ref('')

const reservations = ref([])
const chargementReservations = ref(false)

const initiales = computed(() => {
  if (!user.value) return '?'
  return `${user.value.prenom?.[0] ?? ''}${user.value.nom?.[0] ?? ''}`.toUpperCase()
})

onMounted(async () => {
  if (!user.value?.id) return
  chargementReservations.value = true
  try {
    const { data } = await http.get('api/reservations')
    reservations.value = data.data.filter(r => parseInt(r.userId) === parseInt(user.value.id))
  } catch (e) {
    console.error('Erreur chargement réservations', e)
  } finally {
    chargementReservations.value = false
  }
})

function retour() {
  router.push('/films')
}

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