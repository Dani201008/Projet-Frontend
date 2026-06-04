<!--
  Fichier  : src/views/NotFoundView.vue
  Auteur   : Samuel
  Rôle     : Page 404 affichée pour toute URL inconnue.
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <section class="text-center py-12">
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
      <AppIcon name="compass" :size="32" :stroke-width="1.6" />
    </div>
    <h1 class="text-2xl font-bold mb-2">Page introuvable</h1>
    <p class="text-gray-500 mb-6">La page que vous cherchez n'existe pas.</p>
    <!-- Lien de secours pour ramener l'utilisateur sur l'accueil. -->
    <router-link :to="{ name: 'home' }" class="bg-blue-700 text-white px-5 py-2.5 rounded-lg">
      Retour à l'accueil
    </router-link>
  </section>
</template>

<script>
import AppIcon from '@/components/AppIcon.vue'

export default {
  name: 'NotFoundView',
  components: { AppIcon }
}
</script>