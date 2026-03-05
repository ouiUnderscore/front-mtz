<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <div class="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div class="text-center mb-10">
        <span class="text-4xl">🎬</span>
        <h1 class="text-4xl font-black tracking-[0.2em] uppercase text-white mb-1 mt-3">
          VOD <span class="text-red-500">MTZ</span>
        </h1>
        <p class="text-zinc-500 text-xs tracking-widest uppercase">Rejoignez-nous</p>
      </div>
      <div
        class="w-full max-w-md bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-8 shadow-2xl shadow-black/60"
      >
        <h2 class="text-white font-semibold text-lg mb-6 tracking-wide">Créer un compte</h2>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Nom</label>
            <input v-model="nom" type="text" placeholder="Dupont" :class="inputClass(erreurNom)" />
            <p v-if="erreurNom" class="text-red-400 text-xs mt-1">{{ erreurNom }}</p>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Prénom</label>
            <input
              v-model="prenom"
              type="text"
              placeholder="Jean"
              :class="inputClass(erreurPrenom)"
            />
            <p v-if="erreurPrenom" class="text-red-400 text-xs mt-1">{{ erreurPrenom }}</p>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Pseudo</label>
          <input
            v-model="pseudo"
            type="text"
            placeholder="Votre pseudo"
            :class="inputClass(erreurPseudo)"
          />
          <p v-if="erreurPseudo" class="text-red-400 text-xs mt-1">{{ erreurPseudo }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Âge</label>
          <input
            v-model="age"
            type="number"
            min="1"
            max="120"
            placeholder="25"
            :class="inputClass(erreurAge)"
          />
          <p v-if="erreurAge" class="text-red-400 text-xs mt-1">{{ erreurAge }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Adresse</label>
          <input
            v-model="adresse"
            type="text"
            placeholder="1 rue du Cinéma, Paris"
            :class="inputClass(erreurAdresse)"
          />
          <p v-if="erreurAdresse" class="text-red-400 text-xs mt-1">{{ erreurAdresse }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2"
            >Mot de passe</label
          >
          <input
            v-model="mdp"
            type="password"
            placeholder="••••••••"
            :class="inputClass(erreurMdp)"
          />
          <p v-if="erreurMdp" class="text-red-400 text-xs mt-1">{{ erreurMdp }}</p>
        </div>
        <div class="mb-6">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2"
            >Confirmer le mot de passe</label
          >
          <input
            v-model="mdpConfirm"
            type="password"
            placeholder="••••••••"
            :class="inputClass(erreurMdpConfirm)"
          />
          <p v-if="erreurMdpConfirm" class="text-red-400 text-xs mt-1">{{ erreurMdpConfirm }}</p>
        </div>
        <div
          v-if="erreurGlobale"
          class="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-red-400 text-base">⚠️</span>
          <p class="text-red-400 text-xs">{{ erreurGlobale }}</p>
        </div>
        <div
          v-if="succes"
          class="mb-4 bg-green-950/50 border border-green-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-green-400 text-base">✅</span>
          <p class="text-green-400 text-xs">Compte créé ! Redirection vers la connexion...</p>
        </div>
        <button
          @click="handleRegister"
          :disabled="chargement"
          class="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 mb-3 flex items-center justify-center gap-2"
        >
          <span v-if="chargement" class="animate-spin text-base">⏳</span>
          <span>{{ chargement ? 'Création...' : 'Créer mon compte' }}</span>
        </button>
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-zinc-700"></div>
          <span class="text-zinc-600 text-xs">ou</span>
          <div class="flex-1 h-px bg-zinc-700"></div>
        </div>
        <button
          @click="goToLogin"
          class="w-full bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

const router = useRouter()

const nom = ref('')
const prenom = ref('')
const pseudo = ref('')
const age = ref('')
const adresse = ref('')
const mdp = ref('')
const mdpConfirm = ref('')

const erreurNom = ref('')
const erreurPrenom = ref('')
const erreurPseudo = ref('')
const erreurAge = ref('')
const erreurAdresse = ref('')
const erreurMdp = ref('')
const erreurMdpConfirm = ref('')
const erreurGlobale = ref('')
const chargement = ref(false)
const succes = ref(false)

function inputClass(erreur) {
  return [
    'w-full bg-zinc-800 border text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors duration-200',
    erreur ? 'border-red-500' : 'border-zinc-700 focus:border-red-600',
  ]
}

function valider() {
  erreurNom.value = ''
  erreurPrenom.value = ''
  erreurPseudo.value = ''
  erreurAge.value = ''
  erreurAdresse.value = ''
  erreurMdp.value = ''
  erreurMdpConfirm.value = ''
  erreurGlobale.value = ''
  let valide = true

  if (!nom.value.trim()) {
    erreurNom.value = 'Le nom est obligatoire'
    valide = false
  }
  if (!prenom.value.trim()) {
    erreurPrenom.value = 'Le prénom est obligatoire'
    valide = false
  }
  if (!pseudo.value.trim()) {
    erreurPseudo.value = 'Le pseudo est obligatoire'
    valide = false
  }
  if (!age.value || age.value < 1 || age.value > 120) {
    erreurAge.value = 'Âge invalide'
    valide = false
  }
  if (!adresse.value.trim()) {
    erreurAdresse.value = "L'adresse est obligatoire"
    valide = false
  }
  if (!mdp.value.trim()) {
    erreurMdp.value = 'Le mot de passe est obligatoire'
    valide = false
  }
  if (mdp.value !== mdpConfirm.value) {
    erreurMdpConfirm.value = 'Les mots de passe ne correspondent pas'
    valide = false
  }

  return valide
}

async function handleRegister() {
  if (!valider()) return

  chargement.value = true
  try {
    await http.post(
      '/auth/register',
      { pseudo: pseudo.value, mdp: mdp.value },
      { headers: { 'Content-Type': 'application/json' } },
    )

    const { data } = await http.post(
      '/auth/login',
      { pseudo: pseudo.value, mdp: mdp.value },
      { headers: { 'Content-Type': 'application/json' } },
    )
    localStorage.setItem('token', data.jeton)

    await http.post(
      '/api/users',
      {
        adresse: adresse.value,
        age: parseInt(age.value),
        id: null,
        idReservations: [],
        motDePasse: null,
        nom: nom.value,
        prenom: prenom.value,
        pseudo: pseudo.value,
        statut: true,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    succes.value = true
    setTimeout(() => router.push('/films'), 2000)
  } catch (e) {
    const status = e.response?.status
    if (status === 409) {
      erreurPseudo.value = 'Ce pseudo est déjà utilisé'
    } else if (status === 400) {
      erreurGlobale.value = 'Données invalides, vérifiez les champs'
    } else if (status >= 500) {
      erreurGlobale.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurGlobale.value = 'Inscription impossible, vérifiez votre réseau'
    }
  } finally {
    chargement.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
