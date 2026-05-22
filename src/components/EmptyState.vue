<!--
  Fichier  : src/components/EmptyState.vue
  Auteur   : Samuel
  Rôle     : Bloc générique pour les états vides (pas de résultat, pas encore de recherche…).
  Créé le  : 08.05.2026
  Modifié  : 22.05.2026
-->
<template>
  <!-- Conteneur centré, avec un peu d'air autour. -->
  <div class="text-center py-12 text-gray-500">

    <!-- Icône décorative, masquée aux lecteurs d'écran (le titre suffit). -->
    <div class="text-5xl mb-4" aria-hidden="true">{{ icon }}</div>

    <!-- Titre principal, obligatoire. -->
    <h3 class="text-gray-900 mb-2">{{ title }}</h3>

    <!-- Description optionnelle, affichée seulement si fournie. -->
    <p v-if="description" class="max-w-md mx-auto mb-4">{{ description }}</p>

    <!--
      Slot pour ajouter un bouton ou autre depuis le parent.
      Ex : <EmptyState title="Aucun résultat"><button>Réinitialiser</button></EmptyState>
    -->
    <slot />

  </div>
</template>

<script>
export default {
  name: 'EmptyState',

  props: {
    icon: {
      type: String,
      default: '🔍'
    },

    // Titre court qui décrit l'état vide. Toujours requis.
    title: {
      type: String,
      required: true
    },

    // Petite phrase sous le titre, facultative.
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
