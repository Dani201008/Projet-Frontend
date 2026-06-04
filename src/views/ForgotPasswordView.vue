<!--
  Fichier  : src/views/ForgotPasswordView.vue
  Auteur   : Samuel
  Rôle     : Réinitialisation du mot de passe (email + nouveau mot de passe).
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <div class="max-w-md mx-auto mt-8">
    <section class="bg-white rounded-2xl shadow-md overflow-hidden">
      <AuthBrand />

      <div class="p-8">
        <h2 class="text-xl font-bold mb-2 text-center">Mot de passe oublié</h2>
        <p class="text-sm text-gray-500 text-center mb-6">Indiquez votre email et choisissez un nouveau mot de passe.</p>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <!-- Email du compte -->
          <div>
            <label for="reset-email" class="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
                id="reset-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="votre@email.com"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <!-- Nouveau mot de passe -->
          <div>
            <label for="reset-password" class="block text-sm font-medium mb-1 text-gray-700">Nouveau mot de passe</label>
            <input
                id="reset-password"
                v-model="password"
                type="password"
                required
                minlength="6"
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            />
            <p class="text-xs text-gray-500 mt-1">6 caractères minimum.</p>
          </div>

          <!-- Confirmation -->
          <div>
            <label for="reset-confirm" class="block text-sm font-medium mb-1 text-gray-700">Confirmer le mot de passe</label>
            <input
                id="reset-confirm"
                v-model="confirm"
                type="password"
                required
                autocomplete="new-password"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <p v-if="displayedError" role="alert" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {{ displayedError }}
          </p>

          <button type="submit" class="bg-blue-700 text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition">
            Réinitialiser le mot de passe
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          <router-link :to="{ name: 'login' }" class="text-blue-700 font-medium hover:underline">
            Retour à la connexion
          </router-link>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import AuthBrand from '@/components/AuthBrand.vue'

export default {
  name: 'ForgotPasswordView',
  components: { AuthBrand },

  data() {
    return {
      email: '',
      password: '',
      confirm: '',
      // Erreur de validation côté formulaire (avant l'appel API).
      localError: null
    }
  },

  computed: {
    auth() {
      return useAuthStore()
    },
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

      if (this.password !== this.confirm) {
        this.localError = 'Les mots de passe ne correspondent pas.'
        return
      }

      const ok = await this.auth.resetPassword(this.email.trim(), this.password)
      if (ok) {
        // Réinitialisation réussie : l'utilisateur est reconnecté, direction l'accueil.
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
