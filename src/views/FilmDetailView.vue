<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <!-- Fond décoratif commun -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0a0a_0%,_#09090b_60%)]"
      ></div>
      <div
        class="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent"
      ></div>
      <span class="absolute top-16 left-12 text-3xl opacity-10 rotate-12 select-none">🍿</span>
      <span class="absolute top-32 right-20 text-2xl opacity-10 -rotate-6 select-none">🍿</span>
      <span class="absolute bottom-32 left-24 text-2xl opacity-10 rotate-3 select-none">🎞️</span>
      <span class="absolute bottom-20 right-16 text-3xl opacity-10 -rotate-12 select-none">🍿</span>
      <span class="absolute top-2/3 left-1/2 text-xl opacity-5 rotate-45 select-none">⭐</span>
    </div>

    <!-- Contenu principal -->
    <div class="relative flex-1 flex flex-col px-6 py-12 max-w-3xl mx-auto w-full">

      <!-- Bouton retour -->
      <button
        @click="retour"
        class="flex items-center gap-2 text-zinc-500 hover:text-white text-sm uppercase tracking-widest mb-10 transition-colors duration-200 w-fit"
      >
        <span>←</span>
        <span>Retour aux films</span>
      </button>

      <!-- Chargement -->
      <div v-if="chargement" class="flex flex-col items-center justify-center flex-1 gap-3">
        <span class="animate-spin text-4xl">⏳</span>
        <p class="text-zinc-500 text-sm tracking-widest uppercase">Chargement du film...</p>
      </div>

      <!-- Erreur -->
      <div
        v-else-if="erreur"
        class="bg-red-950/50 border border-red-800/50 rounded-xl px-6 py-5 flex items-center gap-3"
      >
        <span class="text-red-400 text-2xl">⚠️</span>
        <p class="text-red-400 text-sm">{{ erreur }}</p>
      </div>

      <!-- Détail du film -->
      <div v-else-if="film" class="flex flex-col gap-8">

        <!-- En-tête : poster + titre -->
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <!-- Placeholder poster -->
          <div
            class="w-full sm:w-48 h-64 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-center text-6xl flex-shrink-0 shadow-xl shadow-black/40"
          >
            🎥
          </div>

          <!-- Infos principales -->
          <div class="flex flex-col gap-3 flex-1">
            <h1 class="text-white font-black text-3xl tracking-wide leading-tight">
              {{ film.titre }}
            </h1>

            <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
              <span class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full">
                {{ film.anneeReal }}
              </span>
              <span class="bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1 rounded-full">
                {{ film.ageMin }}+
              </span>
              <span
                v-if="film.estDisponible"
                class="bg-green-900/40 border border-green-700/40 text-green-400 px-3 py-1 rounded-full"
              >
                Disponible
              </span>
              <span
                v-else
                class="bg-zinc-800 border border-zinc-700 text-zinc-500 px-3 py-1 rounded-full"
              >
                Indisponible
              </span>
            </div>

            <p class="text-zinc-400 text-sm leading-relaxed">{{ film.description }}</p>

            <div class="mt-auto pt-2">
              <span class="text-red-400 font-black text-2xl">{{ film.prix.toFixed(2) }} €</span>
            </div>
          </div>
        </div>

        <!-- Séparateur -->
        <div class="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        <!-- Informations complémentaires -->
        <div class="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/40">
          <h2 class="text-white font-semibold text-sm uppercase tracking-widest mb-4">
            Informations
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-zinc-600 text-xs uppercase tracking-widest mb-1">Année de réalisation</p>
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
              <p class="text-sm font-medium" :class="film.estDisponible ? 'text-green-400' : 'text-zinc-500'">
                {{ film.estDisponible ? 'Disponible' : 'Indisponible' }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/api/http'

const film = ref(null)
const chargement = ref(false)
const erreur = ref('')
const router = useRouter()
const route = useRoute()

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
