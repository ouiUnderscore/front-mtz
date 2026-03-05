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

      <!-- Titre -->
      <div class="mb-8">
        <h1 class="text-white font-black text-3xl tracking-wide leading-tight">
          Ajouter un <span class="text-red-500">film</span>
        </h1>
        <p class="text-zinc-500 text-xs tracking-widest uppercase mt-2">
          Renseignez les informations du nouveau film
        </p>
      </div>

      <!-- Formulaire -->
      <div class="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl p-8 shadow-xl shadow-black/40">

        <!-- ── Informations générales ── -->
        <h2 class="text-zinc-400 text-xs uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
          Informations générales
        </h2>

        <!-- Titre du film -->
        <div class="mb-5">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Titre</label>
          <input
            v-model="titre"
            type="text"
            placeholder="Ex : Inception"
            :class="inputClass(erreurTitre)"
          />
          <p v-if="erreurTitre" class="text-red-400 text-xs mt-1">{{ erreurTitre }}</p>
        </div>

        <!-- Description -->
        <div class="mb-5">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Description</label>
          <textarea
            v-model="description"
            rows="4"
            placeholder="Synopsis du film..."
            :class="[...inputClass(erreurDescription), 'resize-none']"
          ></textarea>
          <p v-if="erreurDescription" class="text-red-400 text-xs mt-1">{{ erreurDescription }}</p>
        </div>

        <!-- Année + Âge minimum -->
        <div class="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Année de réalisation</label>
            <input
              v-model="anneeReal"
              type="number"
              min="1888"
              :max="anneeMax"
              placeholder="2024"
              :class="inputClass(erreurAnneeReal)"
            />
            <p v-if="erreurAnneeReal" class="text-red-400 text-xs mt-1">{{ erreurAnneeReal }}</p>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Âge minimum</label>
            <input
              v-model="ageMin"
              type="number"
              min="0"
              max="21"
              placeholder="12"
              :class="inputClass(erreurAgeMin)"
            />
            <p v-if="erreurAgeMin" class="text-red-400 text-xs mt-1">{{ erreurAgeMin }}</p>
          </div>
        </div>

        <!-- Prix -->
        <div class="mb-5">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Prix (€)</label>
          <input
            v-model="prix"
            type="number"
            min="0"
            step="0.01"
            placeholder="3.99"
            :class="inputClass(erreurPrix)"
          />
          <p v-if="erreurPrix" class="text-red-400 text-xs mt-1">{{ erreurPrix }}</p>
        </div>

        <!-- Disponibilité -->
        <div class="mb-8">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-3">Disponibilité</label>
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="estDisponible = true"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-xs uppercase tracking-widest font-semibold transition-all duration-200',
                estDisponible
                  ? 'bg-green-900/40 border-green-700/60 text-green-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500',
              ]"
            >
              <span>●</span> Disponible
            </button>
            <button
              type="button"
              @click="estDisponible = false"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-xs uppercase tracking-widest font-semibold transition-all duration-200',
                !estDisponible
                  ? 'bg-zinc-800 border-zinc-500 text-zinc-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500',
              ]"
            >
              <span>●</span> Indisponible
            </button>
          </div>
        </div>

        <!-- ── Médias & Personnes ── -->
        <h2 class="text-zinc-400 text-xs uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
          Médias &amp; Personnes
        </h2>

        <!-- Poster ID + Réalisateur ID -->
        <div class="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">ID Poster</label>
            <input
              v-model="posterId"
              type="text"
              placeholder="Ex : poster-abc123"
              :class="inputClass(erreurPosterId)"
            />
            <p v-if="erreurPosterId" class="text-red-400 text-xs mt-1">{{ erreurPosterId }}</p>
          </div>
          <div>
            <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">ID Réalisateur</label>
            <input
              v-model="realisateurId"
              type="text"
              placeholder="Ex : real-abc123"
              :class="inputClass(erreurRealisateurId)"
            />
            <p v-if="erreurRealisateurId" class="text-red-400 text-xs mt-1">{{ erreurRealisateurId }}</p>
          </div>
        </div>

        <!-- Artistes -->
        <div class="mb-5">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">IDs Artistes</label>
          <div v-if="artisteIds.length > 0" class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(id, index) in artisteIds"
              :key="index"
              class="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full"
            >
              {{ id }}
              <button
                type="button"
                @click="retirerArtiste(index)"
                class="text-zinc-500 hover:text-red-400 transition-colors duration-150 leading-none"
              >✕</button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="nouvelArtisteId"
              type="text"
              placeholder="Ex : artiste-abc123"
              @keyup.enter="ajouterArtiste"
              :class="inputClass(erreurArtisteIds)"
            />
            <button
              type="button"
              @click="ajouterArtiste"
              class="flex-shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs uppercase tracking-widest px-4 rounded-lg transition-all duration-200"
            >
              Ajouter
            </button>
          </div>
          <p v-if="erreurArtisteIds" class="text-red-400 text-xs mt-1">{{ erreurArtisteIds }}</p>
        </div>

        <!-- Genres -->
        <div class="mb-8">
          <label class="block text-zinc-400 text-xs uppercase tracking-widest mb-2">IDs Genres</label>
          <div v-if="genreIds.length > 0" class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(id, index) in genreIds"
              :key="index"
              class="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full"
            >
              {{ id }}
              <button
                type="button"
                @click="retirerGenre(index)"
                class="text-zinc-500 hover:text-red-400 transition-colors duration-150 leading-none"
              >✕</button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="nouveauGenreId"
              type="text"
              placeholder="Ex : genre-abc123"
              @keyup.enter="ajouterGenre"
              :class="inputClass(erreurGenreIds)"
            />
            <button
              type="button"
              @click="ajouterGenre"
              class="flex-shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs uppercase tracking-widest px-4 rounded-lg transition-all duration-200"
            >
              Ajouter
            </button>
          </div>
          <p v-if="erreurGenreIds" class="text-red-400 text-xs mt-1">{{ erreurGenreIds }}</p>
        </div>

        <!-- Erreur globale -->
        <div
          v-if="erreurGlobale"
          class="mb-5 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-red-400 text-base">⚠️</span>
          <p class="text-red-400 text-xs">{{ erreurGlobale }}</p>
        </div>

        <!-- Succès -->
        <div
          v-if="succes"
          class="mb-5 bg-green-950/50 border border-green-800/50 rounded-lg px-4 py-3 flex items-center gap-2"
        >
          <span class="text-green-400 text-base">✅</span>
          <p class="text-green-400 text-xs">Film ajouté avec succès ! Redirection...</p>
        </div>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleSubmit"
            :disabled="chargement"
            class="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span v-if="chargement" class="animate-spin text-base">⏳</span>
            <span>{{ chargement ? 'Ajout en cours...' : 'Ajouter le film' }}</span>
          </button>
          <button
            @click="retour"
            :disabled="chargement"
            class="flex-1 sm:flex-none sm:w-auto bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold uppercase tracking-widest text-sm py-3 px-6 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const anneeMax = new Date().getFullYear()

// ── Champs simples ──
const titre = ref('')
const description = ref('')
const anneeReal = ref('')
const ageMin = ref('')
const prix = ref('')
const estDisponible = ref(true)
const posterId = ref('')
const realisateurId = ref('')

// ── Champs listes ──
const artisteIds = ref([])
const nouvelArtisteId = ref('')
const genreIds = ref([])
const nouveauGenreId = ref('')

// ── Erreurs ──
const erreurTitre = ref('')
const erreurDescription = ref('')
const erreurAnneeReal = ref('')
const erreurAgeMin = ref('')
const erreurPrix = ref('')
const erreurPosterId = ref('')
const erreurRealisateurId = ref('')
const erreurArtisteIds = ref('')
const erreurGenreIds = ref('')
const erreurGlobale = ref('')

const chargement = ref(false)
const succes = ref(false)

// ── Helpers ──
function inputClass(erreur) {
  return [
    'w-full bg-zinc-800 border text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors duration-200',
    erreur ? 'border-red-500' : 'border-zinc-700 focus:border-red-600',
  ]
}

function ajouterArtiste() {
  const val = nouvelArtisteId.value.trim()
  if (!val) return
  if (artisteIds.value.includes(val)) {
    erreurArtisteIds.value = 'Cet ID est déjà dans la liste'
    return
  }
  artisteIds.value.push(val)
  nouvelArtisteId.value = ''
  erreurArtisteIds.value = ''
}

function retirerArtiste(index) {
  artisteIds.value.splice(index, 1)
}

function ajouterGenre() {
  const val = nouveauGenreId.value.trim()
  if (!val) return
  if (genreIds.value.includes(val)) {
    erreurGenreIds.value = 'Cet ID est déjà dans la liste'
    return
  }
  genreIds.value.push(val)
  nouveauGenreId.value = ''
  erreurGenreIds.value = ''
}

function retirerGenre(index) {
  genreIds.value.splice(index, 1)
}

// ── Validation ──
function valider() {
  erreurTitre.value = ''
  erreurDescription.value = ''
  erreurAnneeReal.value = ''
  erreurAgeMin.value = ''
  erreurPrix.value = ''
  erreurPosterId.value = ''
  erreurRealisateurId.value = ''
  erreurArtisteIds.value = ''
  erreurGenreIds.value = ''
  erreurGlobale.value = ''
  let valide = true

  if (!titre.value.trim()) {
    erreurTitre.value = 'Le titre est obligatoire'
    valide = false
  }
  if (!description.value.trim()) {
    erreurDescription.value = 'La description est obligatoire'
    valide = false
  }
  const annee = parseInt(anneeReal.value)
  if (!anneeReal.value || annee < 1888 || annee > anneeMax) {
    erreurAnneeReal.value = `Année invalide (1888 – ${anneeMax})`
    valide = false
  }
  const age = parseInt(ageMin.value)
  if (ageMin.value === '' || isNaN(age) || age < 0 || age > 21) {
    erreurAgeMin.value = 'Âge minimum invalide (0 – 21)'
    valide = false
  }
  const p = parseFloat(prix.value)
  if (prix.value === '' || isNaN(p) || p < 0) {
    erreurPrix.value = 'Prix invalide'
    valide = false
  }
  if (!posterId.value.trim()) {
    erreurPosterId.value = "L'ID poster est obligatoire"
    valide = false
  }
  if (!realisateurId.value.trim()) {
    erreurRealisateurId.value = "L'ID réalisateur est obligatoire"
    valide = false
  }
  if (artisteIds.value.length === 0) {
    erreurArtisteIds.value = 'Ajoutez au moins un artiste'
    valide = false
  }
  if (genreIds.value.length === 0) {
    erreurGenreIds.value = 'Ajoutez au moins un genre'
    valide = false
  }

  return valide
}

// ── Soumission ──
async function handleSubmit() {
  if (!valider()) return

  chargement.value = true
  try {
    await http.post(
      '/api/films',
      {
        id: null,
        titre: titre.value.trim(),
        description: description.value.trim(),
        anneeReal: parseInt(anneeReal.value),
        ageMin: parseInt(ageMin.value),
        prix: parseFloat(parseFloat(prix.value).toFixed(2)),
        estDisponible: estDisponible.value,
        posterId: posterId.value.trim(),
        realisateurId: realisateurId.value.trim(),
        artisteIds: artisteIds.value,
        genreIds: genreIds.value,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    succes.value = true
    setTimeout(() => router.push('/films'), 2000)
  } catch (e) {
    const status = e.response?.status
    if (status === 400) {
      erreurGlobale.value = 'Données invalides, vérifiez les champs'
    } else if (status === 401) {
      erreurGlobale.value = 'Session expirée, veuillez vous reconnecter'
      router.push('/login')
    } else if (status >= 500) {
      erreurGlobale.value = 'Erreur serveur, réessayez plus tard'
    } else {
      erreurGlobale.value = "Impossible d'ajouter le film, vérifiez votre réseau"
    }
  } finally {
    chargement.value = false
  }
}

function retour() {
  router.push('/films')
}
</script>
