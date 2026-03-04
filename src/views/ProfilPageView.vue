<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <Header />

    <main class="max-w-6xl mx-auto px-6 pt-28 pb-16">

      <!-- Bannière -->
      <div class="relative mb-10 rounded-xl overflow-hidden h-36 bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 border border-red-900/30">
        <div class="absolute inset-0 opacity-20"
          style="background-image: repeating-linear-gradient(45deg, #7f1d1d 0px, #7f1d1d 1px, transparent 1px, transparent 12px)">
        </div>
        <div class="absolute bottom-4 left-6 flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-red-900/60 border-2 border-red-500/50 flex items-center justify-center text-2xl font-bold text-red-300">
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
          <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">Informations personnelles</h2>

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
          <h2 class="text-xs text-red-500 tracking-widest uppercase font-semibold mb-4">Compte & activité</h2>

          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Réservations</span>
            <span class="text-zinc-100">{{ user.idReservations?.length ?? 0 }}</span>
          </div>
        </div>

      </div>

    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const auth = useAuthStore()
const user = computed(() => auth.currentUser)

const initiales = computed(() => {
  if (!user.value) return '?'
  return `${user.value.prenom?.[0] ?? ''}${user.value.nom?.[0] ?? ''}`.toUpperCase()
})
</script>