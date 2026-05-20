<!--
  Fichier  : src/views/SearchView.vue
  Auteur   : Timmy (commit 1.4) puis Dani (commit 1.5 — ajout des états)
  Rôle     : Page des résultats avec gestion explicite des états.
  Créé le  : 08.05.2026
  Modifié  : 20.05.2026
-->
<template>
  <!--
    Conteneur principal de la vue.
    - <section> : élément sémantique approprié pour une zone de contenu
      autonome (vs <div> générique) ; améliore la navigation par landmarks
      pour les lecteurs d'écran.
    - flex flex-col gap-6 : empile verticalement les blocs avec un
      espacement régulier, quelle que soit la combinaison d'états affichés.
  -->
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Recherche</h1>

    <!--
      Barre de recherche contrôlée.
      - v-model="searchInput" : synchronise la valeur saisie avec le state local,
        sans déclencher de recherche à chaque frappe.
      - @submit="onSearch" : la recherche n'est déclenchée qu'à la validation
        explicite (Entrée ou bouton), pas au fil de la saisie.
    -->
    <SearchBar v-model="searchInput" @submit="onSearch" />

    <!--
      Compteur de résultats, affiché uniquement quand les trois conditions
      sont réunies simultanément :
        - query    : une recherche a bien été lancée
        - results.length : l'API a retourné au moins un résultat
        - !error   : aucune erreur n'est en cours (évite un compteur affiché
                     en même temps que l'encart d'erreur lors d'un retry)
    -->
    <p v-if="query && results.length && !error" class="text-sm text-gray-500">
      <strong>{{ results.length }}</strong> résultat(s) sur <strong>{{ total }}</strong> pour « {{ query }} »
    </p>

    <!--
      Machine à états visuels : un seul bloc est affiché à la fois.
      Vue évalue les conditions dans l'ordre et s'arrête au premier vrai ;
      l'ordre est donc fonctionnellement significatif :

        1. loading=true          → spinner (priorité absolue, masque tout le reste)
        2. error≠null            → encart rouge + bouton Réessayer
        3. query + 0 résultat    → état vide "Aucun résultat"
        4. pas encore de query   → état vide invite "Lancez une recherche"
        5. sinon                 → grille de résultats (cas nominal)

         Ne pas réordonner ces blocs sans vérifier tous les cas limites
         (ex. : mettre BookList avant ErrorMessage afficherait une liste
         vide ET l'erreur en même temps lors d'un retry échoué).
    -->

    <!-- Cas 1 : chargement en cours. -->
    <LoadingSpinner v-if="loading" message="Recherche en cours..." />

    <!--
      Cas 2 : erreur réseau ou serveur.
      - :message="error" : transmet le message d'erreur construit dans runSearch.
      - :can-retry="true" : toujours proposé ici car l'erreur est réseau
        (potentiellement transitoire), pas une erreur métier définitive.
      - @retry="runSearch(query)" : relance la dernière recherche connue
        sans repasser par onSearch (pas de push dans l'historique).
    -->
    <ErrorMessage
        v-else-if="error"
        :message="error"
        :can-retry="true"
        @retry="runSearch(query)"
    />

    <!--
      Cas 3 : recherche lancée mais aucun résultat retourné par l'API.
      - L'interpolation dans :description reconstruit la phrase avec le
        terme exact recherché pour aider l'utilisateur à reformuler.
    -->
    <EmptyState
        v-else-if="query && !results.length"
        icon="😕"
        title="Aucun résultat trouvé"
        :description="`Aucun livre ne correspond à « ${query} ».`"
    />

    <!--
      Cas 4 : page chargée mais aucune recherche lancée (état initial).
      - Invite l'utilisateur à agir sans afficher un écran vide.
    -->
    <EmptyState
        v-else-if="!query"
        icon="🔍"
        title="Lancez une recherche"
        description="Tapez un titre, un auteur ou un sujet pour commencer."
    />

    <!-- Cas 5 (nominal) : résultats disponibles → on affiche la grille. -->
    <BookList v-else :books="results" />

  </section>
</template>

<script>
import { searchBooks } from '@/services/openLibrary.js'
import SearchBar from '@/components/SearchBar.vue'
import BookList from '@/components/BookList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'SearchView',
  components: { SearchBar, BookList, LoadingSpinner, ErrorMessage, EmptyState },

  data() {
    return {
      /**
       * Valeur brute de l'input, synchronisée avec SearchBar via v-model.
       * Pré-remplie depuis ?q=... si présent à l'arrivée sur la page
       * (lien direct, partage d'URL, retour navigateur).
       */
      searchInput: this.$route.query.q?.toString() || '',

      /** Dernier terme effectivement soumis à l'API (≠ searchInput tant
       *  que l'utilisateur n'a pas validé). Utilisé par le compteur et
       *  les états vides pour construire des messages contextuels. */
      query: '',

      /** Tableau des livres retournés par l'API, normalisés par runSearch. */
      results: [],

      /** Nombre total de résultats côté serveur (peut dépasser results.length
       *  car on limite à 24 par page). Affiché dans le compteur. */
      total: 0,

      /** true pendant toute la durée de l'appel API. */
      loading: false,

      /** Message d'erreur à afficher, ou null si tout va bien. */
      error: null
    }
  },

  watch: {
    /**
     * Surveille le paramètre ?q= dans l'URL.
     * Permet de réagir aux changements sans rechargement de page :
     * - navigation via les boutons Précédent / Suivant du navigateur,
     * - suggestions ou corrections de recherche qui pushent une nouvelle URL,
     * - liens internes vers la recherche avec un terme pré-rempli.
     */
    '$route.query.q'(newQuery) {
      this.searchInput = newQuery?.toString() || ''
      if (newQuery) this.runSearch(newQuery.toString())
    }
  },

  /**
   * Si la page est ouverte avec ?q= déjà dans l'URL (lien direct ou
   * rechargement), on lance la recherche immédiatement sans attendre
   * une interaction utilisateur.
   */
  mounted() {
    const q = this.$route.query.q?.toString()
    if (q) this.runSearch(q)
  },

  methods: {
    /**
     * Gestionnaire du @submit de SearchBar.
     * Pousse le terme dans l'URL plutôt que d'appeler runSearch directement :
     * - l'URL devient partageable et bookmarkable,
     * - les boutons Précédent / Suivant du navigateur naviguent entre les recherches,
     * - le watcher '$route.query.q' prend le relais pour déclencher runSearch.
     *
     * @param {string} term - Terme saisi et validé par l'utilisateur.
     */
    onSearch(term) {
      this.$router.push({ name: 'search', query: { q: term } })
    },

    /**
     * Exécute l'appel API, normalise les données reçues et gère tous les états.
     *
     * Séquence d'exécution :
     *   1. On active le spinner et on réinitialise l'erreur précédente.
     *   2. try   : appel à searchBooks ; on ne garde que les champs affichés.
     *   3. catch : on capture toute erreur réseau ou serveur et on stocke
     *              un message lisible (sans exposer les détails techniques).
     *   4. finally : le spinner s'arrête dans tous les cas — succès ou échec —
     *                pour ne jamais laisser l'UI bloquée en état de chargement.
     *
     * @param {string} term - Terme à envoyer à l'API Open Library.
     */
    async runSearch(term) {
      this.loading = true
      this.error = null
      this.query = term

      try {
        const data = await searchBooks(term, { limit: 24, page: 1 })

        this.results = (data.docs || []).map(doc => ({
          // L'API retourne "/works/OL45W" ; on ne garde que l'identifiant court.
          id: (doc.key || '').replace('/works/', ''),
          title: doc.title || 'Titre inconnu',
          authors: doc.author_name || [],        // tableau de strings
          year: doc.first_publish_year || null,  // null si inconnu (affiché "—" côté BookCard)
          coverId: doc.cover_i || null           // null si pas de couverture disponible
        }))

        this.total = data.numFound || 0

      } catch (err) {
        // On logue l'erreur complète pour le débogage, mais on n'expose
        // pas les détails techniques (stack, URL, code HTTP) à l'utilisateur.
        console.error('Erreur recherche :', err)
        this.error = 'Impossible de récupérer les résultats. Vérifiez votre connexion.'
        this.results = [] // évite d'afficher des résultats obsolètes sous le message d'erreur

      } finally {
        // Exécuté même si try ou catch lance une exception secondaire :
        // garantit que loading repasse à false et que le spinner disparaît.
        this.loading = false
      }
    }
  }
}
</script>