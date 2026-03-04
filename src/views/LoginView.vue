<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <!-- Fond décoratif -->
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
    <div class="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
      <!-- Logo / Titre -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-2 mb-3">
          <span class="text-4xl">🎬</span>
        </div>
        <h1 class="text-4xl font-black tracking-[0.2em] uppercase text-white mb-1">
          VOD <span class="text-red-500">MTZ</span>
        </h1>
        <p class="text-zinc-500 text-xs tracking-widest uppercase">Votre cinéma, partout</p>
      </div>

      <!-- Carte login -->
      <div
        class="w-full max-w-sm bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-8 shadow-2xl shadow-black/60"
      >
        <h2 class="text-white font-semibold text-lg mb-6 tracking-wide">Connexion</h2>

        <!-- Pseudo -->
        <div class="mb-4">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Pseudo</label>
          <input
            v-model="pseudo"
            type="text"
            placeholder="Votre pseudo"
            :class="[
              'w-full bg-zinc-800 border text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors duration-200',
              erreurPseudo ? 'border-red-500' : 'border-zinc-700 focus:border-red-600',
            ]"
          />
          <p v-if="erreurPseudo" class="text-red-400 text-xs mt-1">{{ erreurPseudo }}</p>
        </div>

        <!-- Mot de passe -->
        <div class="mb-6">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2"
            >Mot de passe</label
          >
          <input
            v-model="mdp"
            type="password"
            placeholder="••••••••"
            :class="[
              'w-full bg-zinc-800 border text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors duration-200',
              erreurMdp ? 'border-red-500' : 'border-zinc-700 focus:border-red-600',
            ]"
          />
          <p v-if="erreurMdp" class="text-red-400 text-xs mt-1">{{ erreurMdp }}</p>
        </div>

        <!-- Erreur globale -->
        <div
          v-if="erreurGlobale"
          class="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-red-400 text-base">⚠️</span>
          <p class="text-red-400 text-xs">{{ erreurGlobale }}</p>
        </div>

        <!-- Bouton connexion -->
        <button
          @click="handleLogin"
          :disabled="chargement"
          class="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 mb-3 flex items-center justify-center gap-2"
        >
          <span v-if="chargement" class="animate-spin text-base">⏳</span>
          <span>{{ chargement ? 'Connexion...' : 'Se connecter' }}</span>
        </button>

        <!-- Séparateur -->
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-zinc-700"></div>
          <span class="text-zinc-600 text-xs">ou</span>
          <div class="flex-1 h-px bg-zinc-700"></div>
        </div>

        <!-- Bouton créer un compte -->
        <button
          @click="goToRegister"
          class="w-full bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
        >
          Créer un compte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const pseudo = ref('')
const mdp = ref('')
const erreurPseudo = ref('')
const erreurMdp = ref('')
const erreurGlobale = ref('')
const chargement = ref(false)
const router = useRouter()
const auth = useAuthStore()

function valider() {
  erreurPseudo.value = ''
  erreurMdp.value = ''
  erreurGlobale.value = ''
  let valide = true

  if (!pseudo.value.trim()) {
    erreurPseudo.value = 'Le pseudo est obligatoire'
    valide = false
  }
  if (!mdp.value.trim()) {
    erreurMdp.value = 'Le mot de passe est obligatoire'
    valide = false
  }
  return valide
}

async function handleLogin() {
  if (!valider()) return

  chargement.value = true
  try {
    await auth.login(pseudo.value, mdp.value)
    router.push('/films')
  } catch (e) {
    const status = e.response?.status
    if (status === 401) {
      erreurGlobale.value = 'Pseudo ou mot de passe incorrect'
    } else if (status === 404) {
      erreurGlobale.value = 'Compte introuvable'
    } else if (status >= 500) {
      erreurGlobale.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurGlobale.value = 'Connexion impossible, vérifiez votre réseau'
    }
  } finally {
    chargement.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>
