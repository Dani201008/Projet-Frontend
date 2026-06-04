<!--
  Fichier  : src/components/AuthBrand.vue
  Auteur   : Samuel
  Rôle     : Bandeau de marque en tête des pages connexion et inscription.
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- Dégradé repris du hero : pose l'identité avant même la connexion. -->
  <div class="bg-gradient-to-br from-primary to-primary-dark text-white text-center px-8 py-8">
    <AppIcon name="book-open" :size="40" :stroke-width="1.4" class="mx-auto mb-3" />
    <h1 class="text-2xl font-bold">Media Explorer</h1>
    <p class="text-sm tracking-wide opacity-90 mt-2">Des millions de livres. Une seule recherche.</p>
  </div>
</template>

<script>
import AppIcon from '@/components/AppIcon.vue'

export default {
  name: 'AuthBrand',
  components: { AppIcon }
}
</script>
