<template>
  <header
    class="top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-red-900/30"
  >
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎬</span>
          <span class="font-bold text-white tracking-widest uppercase text-sm">
            VOD <span class="text-red-500">MTZ</span>
          </span>
        </div>
      </a>

      <div v-if="auth.isAuthenticated" class="flex items-center gap-4">
        <RouterLink to="/films">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🎬</span>
            <span class="font-bold text-white tracking-widest uppercase text-sm">
              VOD <span class="text-red-500">MTZ</span>
            </span>
          </div>
        </RouterLink>

        <button
          @click="handleLogout"
          class="text-xs text-zinc-400 hover:text-red-400 tracking-widest uppercase transition-colors duration-200 border border-zinc-700 hover:border-red-800 px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
