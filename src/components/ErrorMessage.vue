<!--
  Fichier  : src/components/ErrorMessage.vue
  Auteur   : Dani
  Rôle     : Encart d'erreur avec bouton « Réessayer » optionnel.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <!--
    Conteneur principal de l'encart d'erreur.
    - role="alert" : région ARIA à priorité haute — le lecteur d'écran
      interrompt ce qu'il lit et annonce immédiatement le contenu,
      contrairement à aria-live="polite" qui attend une pause.
    - Le fond rouge clair + bordure rouge signalent visuellement l'erreur
      sans reposer uniquement sur la couleur (l'icône et le texte complètent).
  -->
  <div role="alert" class="flex gap-4 p-6 bg-red-50 border border-red-300 rounded-lg text-red-900">

    <!-- Icône purement décorative ; les lecteurs d'écran l'ignorent
         car elle ne porte pas d'information que le texte ne donne déjà. -->
    <span class="text-2xl" aria-hidden="true">⚠️</span>

    <div class="flex-1 flex flex-col gap-2 items-start">

      <!-- Message d'erreur transmis par le parent via la prop `message`. -->
      <p>{{ message }}</p>

      <!--
        Bouton « Réessayer », conditionnel à la prop `canRetry`.
        - v-if="canRetry" : rendu uniquement si le parent indique qu'une
          nouvelle tentative est possible (ex. : erreur réseau récupérable
          mais pas une erreur 404).
        - type="button" : empêche toute soumission de formulaire accidentelle
          si le composant est utilisé à l'intérieur d'un <form>.
        - @click → $emit('retry') : le composant ne recharge rien lui-même ;
          il délègue l'action au parent qui connaît la logique métier.
      -->
      <button
          v-if="canRetry"
          type="button"
          class="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg"
          @click="$emit('retry')"
      >
        Réessayer
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',

  props: {
    /**
     * Texte de l'erreur à afficher, fourni obligatoirement par le parent.
     * Exemples : 'Impossible de charger les données.', 'Connexion perdue.'
     */
    message: {
      type: String,
      required: true
    },

    /**
     * Contrôle l'affichage du bouton « Réessayer ».
     * Passer `true` uniquement si l'erreur est récupérable et qu'une
     * nouvelle tentative a du sens (ex. : timeout réseau).
     * Par défaut : false (erreur définitive, pas d'action proposée).
     */
    canRetry: {
      type: Boolean,
      default: false
    }
  },

  /**
   * Événements émis par ce composant :
   * - 'retry' : déclenché au clic sur « Réessayer ».
   *   Le parent doit écouter cet événement pour relancer l'action échouée.
   *   Exemple d'utilisation : <ErrorMessage @retry="fetchData" ... />
   */
  emits: ['retry']
}
</script>