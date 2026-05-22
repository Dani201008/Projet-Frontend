<!--
  Fichier  : src/components/LoadingSpinner.vue
  Auteur   : Dani
  Rôle     : Indicateur de chargement accessible.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <!--
    Conteneur principal du spinner.
    - role="status" : indique aux technologies d'assistance que ce bloc
      représente un état dynamique de l'application.
    - aria-live="polite" : le lecteur d'écran annonce le contenu dès qu'il
      devient disponible, sans interrompre l'utilisateur en cours de frappe.
    - Les classes Tailwind centrent les éléments verticalement avec un
      espacement interne confortable.
  -->
  <div role="status" aria-live="polite" class="flex flex-col items-center gap-4 p-8">

    <!--
      Cercle animé (purement visuel).
      - border-blue-100 : bordure quasi-transparente sur les 3/4 du cercle,
        crée l'illusion d'un arc incomplet.
      - border-t-blue-700 : seul le bord supérieur est foncé ; c'est ce
        contraste qui donne l'effet de rotation visible.
      - animate-spin : applique une rotation CSS continue (360° en boucle).
      - aria-hidden="true" : masque l'élément aux lecteurs d'écran, car
        l'information de chargement est déjà portée par le conteneur parent.
    -->
    <div
        class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin"
        aria-hidden="true"
    ></div>

    <!-- Message texte affiché sous le spinner, lu par les lecteurs d'écran
         grâce à aria-live sur le parent. Défini via la prop `message`. -->
    <p class="text-gray-500 text-sm">{{ message }}</p>

  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',

  props: {
    /**
     * Texte affiché sous l'animation et annoncé aux lecteurs d'écran.
     * Personnalisable selon le contexte d'utilisation :
     *   <LoadingSpinner message="Envoi en cours..." />
     * Par défaut : 'Chargement...'
     */
    message: {
      type: String,
      default: 'Chargement...'
    }
  }
}
</script>