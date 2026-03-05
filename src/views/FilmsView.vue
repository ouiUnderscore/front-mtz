<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <Header />
    <!-- Contenu principal -->
    <div class="relative flex-1 flex flex-col px-6 py-12">
      <!-- Titre -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-2 mb-3">
          <span class="text-4xl">🎬</span>
        </div>
        <h1 class="text-4xl font-black tracking-[0.2em] uppercase text-white mb-1">
          VOD <span class="text-red-500">MTZ</span>
        </h1>
        <p class="text-zinc-500 text-xs tracking-widest uppercase">Votre cinéma, partout</p>
      </div>

      <!-- Barre d'actions -->
      <div class="flex justify-end max-w-7xl mx-auto w-full mb-6">
        <button
          @click="ajouterFilm"
          class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          <span class="text-base leading-none">＋</span>
          <span>Ajouter un film</span>
        </button>
      </div>

      <!-- Chargement -->
      <div v-if="chargement" class="flex flex-col items-center justify-center flex-1 gap-3">
        <span class="animate-spin text-4xl">⏳</span>
        <p class="text-zinc-500 text-sm tracking-widest uppercase">Chargement des films...</p>
      </div>

      <!-- Erreur -->
      <div
        v-else-if="erreur"
        class="max-w-md mx-auto bg-red-950/50 border border-red-800/50 rounded-xl px-6 py-5 flex items-center gap-3"
      >
        <span class="text-red-400 text-2xl">⚠️</span>
        <p class="text-red-400 text-sm">{{ erreur }}</p>
      </div>

      <!-- Grille de films -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full"
      >
        <div
          v-for="film in films"
          :key="film.id"
          @click="voirFilm(film.id)"
          class="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-black/40 cursor-pointer hover:border-red-700/60 hover:shadow-red-900/20 transition-all duration-200 group"
        >
          <!-- Placeholder poster -->
          <div
            class="w-full h-48 bg-zinc-800 flex items-center justify-center text-5xl group-hover:bg-zinc-700/60 transition-colors duration-200"
          >
            🎥
          </div>

          <!-- Infos -->
          <div class="p-4">
            <h2 class="text-white font-bold text-base tracking-wide truncate mb-1">
              {{ film.titre }}
            </h2>
            <p class="text-zinc-500 text-xs line-clamp-2 mb-3">{{ film.description }}</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-zinc-400 text-xs">
                <span>{{ film.anneeReal }}</span>
                <span class="text-zinc-700">•</span>
                <span>{{ film.ageMin }}+</span>
              </div>
              <span class="text-red-400 font-bold text-sm"> {{ film.prix.toFixed(2) }} € </span>
            </div>

            <!-- Disponibilité -->
            <div class="mt-3">
              <span
                v-if="film.estDisponible"
                class="inline-block bg-green-900/40 border border-green-700/40 text-green-400 text-xs px-2 py-0.5 rounded-full uppercase tracking-widest"
              >
                Disponible
              </span>
              <span
                v-else
                class="inline-block bg-zinc-800 border border-zinc-700 text-zinc-500 text-xs px-2 py-0.5 rounded-full uppercase tracking-widest"
              >
                Indisponible
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun film -->
      <div
        v-if="!chargement && !erreur && films.length === 0"
        class="flex flex-col items-center justify-center flex-1 gap-3"
      >
        <span class="text-5xl opacity-30">🎞️</span>
        <p class="text-zinc-500 text-sm tracking-widest uppercase">Aucun film disponible</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const films = ref([])
const chargement = ref(false)
const erreur = ref('')
const router = useRouter()

async function chargerFilms() {
  chargement.value = true
  erreur.value = ''
  try {
    const response = await http.get('/api/films')
    films.value = response.data
  } catch (e) {
    const status = e.response?.status
    if (status === 401) {
      erreur.value = 'Session expirée, veuillez vous reconnecter'
      router.push('/login')
    } else if (status >= 500) {
      erreur.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreur.value = 'Impossible de charger les films, vérifiez votre réseau'
    }
  } finally {
    chargement.value = false
  }
}

function voirFilm(id) {
  router.push(`/films/${id}`)
}

function ajouterFilm() {
  router.push('/films/ajouter')
}

onMounted(() => {
  chargerFilms()
})
</script>
