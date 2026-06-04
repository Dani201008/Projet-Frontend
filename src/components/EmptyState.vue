<!--
  Fichier  : src/components/EmptyState.vue
  Auteur   : Dani
  Rôle     : Bloc générique pour les états vides (pas de résultat, pas encore de recherche…).
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <div class="text-center py-14 text-gray-500">
    <!-- Pastille ronde + icône : un état vide soigné plutôt qu'un simple emoji. -->
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
      <AppIcon :name="icon" :size="30" :stroke-width="1.6" />
    </div>
    <h3 class="text-gray-900 mb-2">{{ title }}</h3>
    <!-- Description optionnelle, pas affichée si la prop est vide. -->
    <p v-if="description" class="max-w-md mx-auto mb-4">{{ description }}</p>
    <!-- Slot pour permettre au parent d'injecter un bouton (ex. « Aller à la recherche »). -->
    <slot />
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'EmptyState',
  components: { AppIcon },
  props: {
    // Nom d'icône AppIcon (ex. 'search', 'search-x', 'heart').
    icon: { type: String, default: 'search' },
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }
}
</script>
