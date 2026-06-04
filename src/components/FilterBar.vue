<!--
  Fichier  : src/components/FilterBar.vue
  Auteur   : Timmy
  Rôle     : Barre de tri et de filtre (tri serveur + année minimale) des résultats.
  Créé le  : 29.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <div class="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm mb-6">
    <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
      <label for="sort-by" class="text-sm font-medium text-gray-500">Trier par</label>
      <select
        id="sort-by"
        :value="sort"
        class="px-3 py-2 border border-gray-200 rounded-md bg-white"
        @change="$emit('update:sort', $event.target.value)"
      >
        <option value="relevance">Pertinence</option>
        <option value="new">Plus récents</option>
        <option value="old">Plus anciens</option>
      </select>
    </div>

    <div class="flex flex-col gap-1 flex-1 min-w-[150px]">
      <label for="min-year" class="text-sm font-medium text-gray-500">Année min.</label>
      <!-- @change (et non @input) : on relance la recherche quand l'utilisateur valide l'année, pas à chaque frappe. -->
      <input
        id="min-year"
        type="number"
        :value="minYear"
        placeholder="ex: 2000"
        min="0"
        max="2100"
        class="px-3 py-2 border border-gray-200 rounded-md bg-white"
        @change="$emit('update:minYear', $event.target.value)"
      />
    </div>

    <!-- Bouton de remise à zéro : visible seulement si un tri ou un filtre est actif. -->
    <button
      v-if="hasFilters"
      type="button"
      class="border border-primary text-primary px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-primary-light"
      @click="$emit('reset')"
    >
      Réinitialiser
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    sort: { type: String, default: 'relevance' },
    minYear: { type: [String, Number], default: '' }
  },
  emits: ['update:sort', 'update:minYear', 'reset'],
  computed: {
    // Vrai dès qu'un tri ou un filtre est appliqué : pilote l'affichage du bouton « Réinitialiser ».
    hasFilters() {
      return this.sort !== 'relevance' || !!this.minYear
    }
  }
}
</script>
