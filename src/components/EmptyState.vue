<!--
  Fichier  : src/components/EmptyState.vue
  Auteur   : Dani
  Rôle     : Bloc générique pour les états vides (pas de résultat, pas encore de recherche…).
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <!--
    Conteneur principal centré.
    - py-12 : espacement vertical généreux pour que le bloc respire
      et ne soit pas confondu avec un simple message inline.
    - text-gray-500 : teinte neutre par défaut ; le titre et l'icône
      peuvent surcharger cette couleur individuellement.
  -->
  <div class="text-center py-12 text-gray-500">

    <!--
      Icône décorative (emoji ou caractère Unicode) passée via la prop `icon`.
      - aria-hidden="true" : masqué aux lecteurs d'écran ; l'information
        est déjà portée par le titre qui suit.
      - text-5xl : taille large pour attirer l'œil sans texte superflu.
    -->
    <div class="text-5xl mb-4" aria-hidden="true">{{ icon }}</div>

    <!--
      Titre principal de l'état vide, obligatoire.
      - <h3> : niveau sémantique adapté à un sous-bloc de page ;
        à ajuster si le composant est utilisé comme titre de section principale.
    -->
    <h3 class="text-gray-900 mb-2">{{ title }}</h3>

    <!--
      Description complémentaire, optionnelle.
      - v-if="description" : l'élément n'est pas rendu du tout si la prop
        est vide, évitant un <p> vide dans le DOM.
      - max-w-md mx-auto : limite la largeur de lecture pour un meilleur
        confort sur grands écrans.
    -->
    <p v-if="description" class="max-w-md mx-auto mb-4">{{ description }}</p>

    <!--
      Slot par défaut : point d'extension pour le contenu injecté par le parent.
      Permet d'ajouter un bouton d'action contextuel sans coupler ce composant
      à une logique métier spécifique.

      Exemple d'utilisation :
        <EmptyState title="Aucun résultat" icon="🔍">
          <button @click="resetSearch">Réinitialiser la recherche</button>
        </EmptyState>

      Si aucun contenu n'est fourni, le slot ne génère rien dans le DOM.
    -->
    <slot />

  </div>
</template>

<script>
export default {
  name: 'EmptyState',

  props: {
    /**
     * Emoji ou caractère Unicode affiché en grand au-dessus du titre.
     * Doit rester décoratif : ne pas y mettre d'information absente du titre.
     * Par défaut : '🔍' (contexte de recherche sans résultat).
     */
    icon: {
      type: String,
      default: '🔍'
    },

    /**
     * Titre court décrivant l'état vide, affiché en texte foncé.
     * Obligatoire — c'est le seul contenu garanti lu par les lecteurs d'écran.
     * Exemples : 'Aucun résultat', 'Commencez par rechercher un pokémon.'
     */
    title: {
      type: String,
      required: true
    },

    /**
     * Phrase explicative optionnelle sous le titre.
     * À utiliser pour guider l'utilisateur vers une action ou expliquer
     * pourquoi la liste est vide.
     * Laisser vide (défaut) si le titre seul est suffisamment explicite.
     */
    description: {
      type: String,
      default: ''
    }
  }
}
</script>