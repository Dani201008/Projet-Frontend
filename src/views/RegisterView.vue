<!--
  Fichier  : src/views/RegisterView.vue
  Auteur   : Samuel
  Rôle     : Page d'inscription (nom + email + mot de passe + confirmation).
  Créé le  : 29.05.2026
  Modifié  : 01.06.2026
-->
<template>
  <section class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Créer un compte</h1>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- Nom -->
      <div>
        <label for="register-name" class="block text-sm font-medium mb-1 text-gray-700">Nom</label>
        <input
            id="register-name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="Prénom Nom"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="register-email" class="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
            id="register-email"
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
        <label for="register-password" class="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
        <input
            id="register-password"
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
        />
        <p class="text-xs text-gray-500 mt-1">6 caractères minimum.</p>
      </div>

      <!-- Confirmation du mot de passe -->
      <div>
        <label for="register-confirm" class="block text-sm font-medium mb-1 text-gray-700">Confirmer le mot de passe</label>
        <input
            id="register-confirm"
            v-model="confirm"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <!-- Message d'erreur (local ou venant du store) -->
      <p v-if="displayedError" role="alert" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
        {{ displayedError }}
      </p>

      <button type="submit" class="bg-blue-700 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition">
        Créer mon compte
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      Déjà un compte ?
      <router-link :to="{ name: 'login' }" class="text-blue-700 font-medium hover:underline">
        Se connecter
      </router-link>
    </p>
  </section>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'RegisterView',

  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirm: '',
      // Erreur locale (validation côté formulaire avant d'appeler le store).
      localError: null
    }
  },

  computed: {
    auth() {
      return useAuthStore()
    },
    // L'erreur affichée vient soit de la validation locale, soit du store.
    displayedError() {
      return this.localError || this.auth.error
    }
  },

  mounted() {
    this.auth.clearError()
  },

  methods: {
    async onSubmit() {
      this.localError = null

      // Vérifie que les deux mots de passe correspondent.
      if (this.password !== this.confirm) {
        this.localError = 'Les mots de passe ne correspondent pas.'
        return
      }

      const ok = await this.auth.register(this.name.trim(), this.email.trim(), this.password)
      if (ok) {
        // L'inscription connecte automatiquement, on redirige vers l'accueil.
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
