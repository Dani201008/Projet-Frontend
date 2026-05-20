<!--
  Fichier  : src/components/EmptyState.vue
  Auteur   : Dani
  Rôle     : Bloc générique pour les états vides (pas de résultat, pas encore de recherche…).
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <div class="text-center py-12 text-gray-500">
    <div class="text-5xl mb-4">{{ icon }}</div>
    <h3 class="text-gray-900 mb-2">{{ title }}</h3>
    <!-- Description optionnelle, pas affichée si la prop est vide. -->
    <p v-if="description" class="max-w-md mx-auto mb-4">{{ description }}</p>
    <!-- Slot pour permettre au parent d'injecter un bouton (ex. « Aller à la recherche »). -->
    <slot />
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: { type: String, default: '🔍' },
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }
}
</script>
