<!--
  Fichier  : src/views/LoginView.vue
  Auteur   : Samuel
  Rôle     : Page de connexion (formulaire email + mot de passe).
  Créé le  : 29.05.2026
  Modifié  : 01.06.2026
-->
<template>
  <section class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- Email -->
      <div>
        <label for="login-email" class="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
            id="login-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="votre@email.com"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <!-- Mot de passe -->
      <div>
        <label for="login-password" class="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
        <input
            id="login-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <!-- Message d'erreur éventuel -->
      <p v-if="auth.error" role="alert" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
        {{ auth.error }}
      </p>

      <button type="submit" class="bg-blue-700 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition">
        Se connecter
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      Pas encore de compte ?
      <router-link :to="{ name: 'register' }" class="text-blue-700 font-medium hover:underline">
        Créer un compte
      </router-link>
    </p>
  </section>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'LoginView',

  data() {
    return {
      email: '',
      password: ''
    }
  },

  computed: {
    auth() {
      return useAuthStore()
    }
  },

  // Nettoie le message d'erreur en arrivant sur la page.
  mounted() {
    this.auth.clearError()
  },

  methods: {
    async onSubmit() {
      const ok = await this.auth.login(this.email.trim(), this.password)
      if (ok) {
        // Redirection vers l'accueil après connexion réussie.
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
