<!--
  Fichier  : src/components/AppIcon.vue
  Auteur   : Samuel
  Rôle     : Jeu d'icônes SVG (style trait), choisies par leur nom. Héritent de la couleur du texte.
  Créé le  : 04.06.2026
  Modifié  : 04.06.2026
-->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="inner"
  />
</template>

<script>
// Tracés SVG (repère 24x24), regroupés ici pour éviter de répéter du markup dans chaque composant.
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/>',
  'search-x': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/><line x1="8.6" y1="8.6" x2="13.4" y2="13.4"/><line x1="13.4" y1="8.6" x2="8.6" y2="13.4"/>',
  sliders: '<line x1="4" y1="8" x2="13" y2="8"/><line x1="17" y1="8" x2="20" y2="8"/><circle cx="15" cy="8" r="2"/><line x1="4" y1="16" x2="7" y2="16"/><line x1="11" y1="16" x2="20" y2="16"/><circle cx="9" cy="16" r="2"/>',
  heart: '<path d="M12 20.3l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 5.42 3.42 4 5.5 4c1.74 0 3.41 1.01 4.5 2.6C11.09 5.01 12.76 4 14.5 4 16.58 4 18 5.42 18 7.5c0 3.78-3.4 6.86-8.55 11.54z"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5"/>',
  alert: '<path d="M10.3 4L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13.5"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'arrow-left': '<line x1="20" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  'book-open': '<path d="M2 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z"/><path d="M22 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="3.5"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>'
}

export default {
  name: 'AppIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 24 },
    // Remplit l'icône plutôt que de la laisser en contour (ex. cœur « favori actif »).
    filled: { type: Boolean, default: false },
    strokeWidth: { type: [Number, String], default: 1.8 }
  },
  computed: {
    inner() {
      return ICONS[this.name] || ''
    }
  }
}
</script>
