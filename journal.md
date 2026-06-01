# Journal de travail – Media Explorer

> Suivi pédagogique du projet **Media Explorer** (module FrontEnd, CPNV, 4e trimestre, 2e année CFC informaticien).
> Une entrée par sprint, signée par l'équipe : **Samuel** (Scrum Master), **Dani**, **Timmy**.
>
> Format de chaque entrée : ce qui a été fait, qui a fait quoi, décisions prises, blocages rencontrés, ce qui reste à faire.

---

## Sprint 0 — Préparation et fondations techniques

**Semaine 1** — du `[lundi XX.04.2026]` au `[vendredi XX.04.2026]`

### Ce qui a été fait

Mise en place complète des fondations du projet avant d'attaquer le code des fonctionnalités.

- **Choix de l'API** parmi celles listées dans les spécifications (OMDB, TheMovieDB, OpenBreweryDB, OpenLibrary, ISBNdb). Comparaison de trois candidates (OMDB, TheMovieDB, OpenLibrary) sur quatre critères : authentification, limite de requêtes, richesse des données, qualité de la doc. **OpenLibrary** retenue parce que c'est la seule qui ne demande pas de clé d'API (zéro friction pour l'évaluateur qui clone le projet) et que les données sur les livres sont complètes (titre, auteurs, couvertures, sujets, date de publication).

- **Lecture de la documentation OpenLibrary** (<https://openlibrary.org/developers/api>). Endpoints retenus :
  - `GET /search.json?q=…&limit=…&page=…` — recherche paginée
  - `GET /works/{id}.json` — détails d'un livre
  - `GET /authors/{id}.json` — info d'un auteur (deuxième requête car non incluse dans `/works`)
  - `https://covers.openlibrary.org/b/id/{cover_i}-{S|M|L}.jpg` — couvertures

- **Initialisation du projet Vue 3** : `package.json`, `vite.config.js`, `index.html`, `main.js` qui branche Vue + Pinia + Vue Router + CSS global. Stack figée : Vue 3 (Options API), Vue Router 4, Pinia 2, Axios, Tailwind CSS 4, Vite.

- **Arborescence `src/` complète** posée d'avance avec tous les composants (9), vues (5), stores (2) et le service OpenLibrary en placeholders vides. Dès Sprint 1, chacun sait où placer son code.

- **Dépôt GitHub** `Dani201008/Projet-Frontend` créé, 3 collaborateurs ajoutés, branche `main` protégée (au moins 1 review obligatoire avant merge), `.gitignore` configuré (Node.js, Vue, WebStorm).

- **Fichier `conventions`** rédigé collectivement : commits en français à l'impératif avec préfixes `feat:` / `fix:` / `docs:` / `style:` / `refactor:` / `chore:`, branches `feat/<sujet>` à merger via PR, composants en PascalCase, services/stores en camelCase, **Options API uniquement**, pas d'appel HTTP dans un `.vue` (toujours via `src/services/`), pas de `localStorage` direct (toujours via un store Pinia).

- **README initial** publié : présentation, fonctionnalités prévues, stack, prérequis (Node 18+, npm), installation pas à pas, renvoi vers `conventions`.

### Qui a fait quoi

| Tâche | Owner |
|-------|-------|
| Comparatif des API + choix d'OpenLibrary | Atelier équipe (3) — animé par Samuel |
| Lecture documentation OpenLibrary | Dani |
| Init Vue 3 + Vite + Tailwind | Samuel |
| Arborescence `src/` avec placeholders | Samuel |
| Création dépôt GitHub + droits + protection `main` | Samuel |
| Rédaction du fichier `conventions` | Dani *(PR #22)* |
| README initial | Samuel |
| Maquettes des 5 écrans | Timmy *(en cours, à finaliser en Sprint 1)* |

### Décisions

- **API : OpenLibrary** — pas de clé, données riches, doc claire.
- **API style : Options API** *(et non Composition API)* — choix pédagogique : plus lisible pour des étudiants 2e année, moins de concepts à manipuler, suffisant pour la taille du projet. La grille de correction officielle mentionne « Composition API » mais notre tuteur valide Options API.
- **Tailwind v4** plutôt que v3 — version la plus récente, syntaxe `@theme` plus propre que l'ancien `tailwind.config.js`.
- **Branche `main` protégée** — toute modification passe par une PR avec au moins une review. Évite les push directs et les conflits non revus.
- **Pas de Composition API** dans tout le projet → ligne ajoutée explicitement au fichier `conventions` pour qu'il n'y ait pas d'ambiguïté.
- **Pré-créer toute l'arborescence en placeholders vides** plutôt que la créer petit à petit — permet à chacun de modifier des fichiers existants au lieu d'en créer, et évite les conflits sur la structure.

### Blocages / surprises

`[à compléter — ex. « hésitation entre TheMovieDB et OpenLibrary jusqu'à ce qu'on réalise que TMDB demande une clé d'API », « configuration Tailwind 4 différente de Tailwind 3, on a perdu un peu de temps sur la nouvelle syntaxe @theme », « WebStorm ne reconnaissait pas l'alias @/ au début, il a fallu vérifier vite.config.js ».]`

### Commits livrés sur `main` (Sprint 0)

| Hash | Message | Auteur |
|------|---------|--------|
| `618f7ac` | Initial commit | Samuel |
| `99eae18` | Add project conventions document | Dani |
| `f94a8b4` | Merge pull request #22 from Dani201008/docs/conventions | merge |
| `0511bd4` | docs: rédige le README complet du projet | Samuel |
| `5cde354` | docs: rédige le README complet du projet *(refonte)* | Samuel |
| `74aecf6` | chore: initialise le projet Vue 3 et prépare l'arborescence complète | Samuel |

### Reste à faire pour clôturer Sprint 0

- ⏳ **Maquettes des 5 écrans** (US-T03) — Timmy, à finaliser en parallèle de Sprint 1, à pousser dans `docs/maquettes/` ou en lien Figma dans ce journal
- ✅ **Journal de travail** (US-T06) — initialisé par cette entrée

### Bilan

Démarrage propre. Dépôt prêt, conventions partagées, arborescence en place. L'app est dans un état déployable mais sans fonctionnalité visible — c'est volontaire : tout est prêt à être rempli au Sprint 1 sans avoir à se poser de questions de structure ou de configuration. Le plan de commits Sprint 1 → 4 est rédigé, chacun connaît sa charge et ses dépendances.

**Signé** : Samuel, Dani, Timmy — `[XX.04.2026]`

---

## Sprint 1 — Recherche, affichage et fondations de navigation

**Semaines 2 & 3** — du `[à compléter]` au `[à compléter]`

### Objectifs du sprint
Implémenter la recherche par mot-clé, l'affichage des résultats en grille, la gestion des états (chargement, erreur, vide), et poser la navigation de base (header sticky, footer, page 404).

### Commits attendus (5)

| # | Branche | Auteur | US |
|---|---------|--------|----|
| 1.1 | `feat/service-openlibrary` | Dani | prépare US-01 |
| 1.2 | `feat/routing-base` | Samuel | US-08, US-09 |
| 1.3 | `feat/search-bar` | Timmy | US-01 |
| 1.4 | `feat/search-results` | Timmy | US-02 |
| 1.5 | `feat/states-search` | Dani | US-03, US-04, US-05 |

### Ce qui a été fait
`[à compléter en fin de sprint]`

### Qui a fait quoi
`[à compléter]`

### Décisions
`[à compléter — ex. choix de design / palette, choix d'un nom de variable, refonte d'un composant ?]`

### Blocages / surprises
`[à compléter]`

### Bilan
`[à compléter]`

**Signé** : Samuel, Dani, Timmy — `[date]`

---

## Sprint 2 — Vue détaillée

**Semaines 4 & 5** — du `[à compléter]` au `[à compléter]`

### Objectifs du sprint
Brancher la fiche détaillée d'un livre : route `/book/:id`, fetch des détails + noms d'auteurs (en parallèle via `Promise.all`), bouton retour, lien externe vers OpenLibrary.

### Commits attendus (2)

| # | Branche | Auteur | US |
|---|---------|--------|----|
| 2.1 | `feat/service-details` | Dani | prépare US-06 |
| 2.2 | `feat/detail-view` | Timmy | US-06, US-07 |

### Ce qui a été fait
`[à compléter en fin de sprint]`

### Qui a fait quoi
`[à compléter]`

### Décisions
`[à compléter]`

### Blocages / surprises
`[à compléter]`

### Bilan
`[à compléter]`

**Signé** : Samuel, Dani, Timmy — `[date]`

---

## Sprint 3 — État global, favoris, tri, filtres

**Semaines 6 & 7** — du `[à compléter]` au `[à compléter]`

### Objectifs du sprint
Introduire les stores Pinia (recherche + favoris), ajouter le tri, le filtre par année minimale, la pagination « Charger plus », la page Favoris et le badge dans la navigation.

### Commits attendus (5)

| # | Branche | Auteur | US |
|---|---------|--------|----|
| 3.1 | `feat/store-books` | Dani | refactor technique |
| 3.2 | `feat/filter-bar` | Timmy | US-14, US-15, US-16 |
| 3.3 | `feat/pagination` | Dani | US-17 |
| 3.4 | `feat/store-favorites` | Dani | US-10, US-11 |
| 3.5 | `feat/favorites-view` | Timmy | US-12, US-13 |

### Ce qui a été fait
`[à compléter en fin de sprint]`

### Qui a fait quoi
`[à compléter]`

### Décisions
`[à compléter — ex. structure du store, choix de la clé localStorage, design du badge, etc.]`

### Blocages / surprises
`[à compléter]`

### Bilan
`[à compléter]`

**Signé** : Samuel, Dani, Timmy — `[date]`

---

## Sprint 4 — Finitions et UX

**Semaine 8** — du `[à compléter]` au `[à compléter]`

### Objectifs du sprint
Finaliser le design : palette de couleurs personnalisée + classes `.btn`, transitions fondu entre pages, titre d'onglet dynamique, hero d'accueil avec suggestions cliquables, README final complet pour la grille de correction. Préparer la démo.

### Commits attendus (5)

| # | Branche | Auteur | US |
|---|---------|--------|----|
| 4.1 | `style/theme-tokens` | Samuel | technique |
| 4.2 | `feat/page-transitions` | Timmy | US-20 |
| 4.3 | `feat/page-title` | Samuel | US-21 |
| 4.4 | `feat/home-hero` | Timmy | US-18 |
| 4.5 | `docs/readme-final` | Samuel | – |

### Ce qui a été fait
`[à compléter en fin de sprint]`

### Qui a fait quoi
`[à compléter]`

### Décisions
`[à compléter]`

### Blocages / surprises
`[à compléter]`

### Préparation de la démo
`[à compléter — quel parcours utilisateur sera montré ? quel terme de recherche d'exemple ?]`

### Bilan final
`[à compléter — note auto-évaluée sur la grille, fierté collective, leçons retenues]`

**Signé** : Samuel, Dani, Timmy — `[date]`

---

## Liens utiles

- Tableau de bord projet : <https://github.com/users/Dani201008/projects/1>
- Dépôt GitHub : <https://github.com/Dani201008/Projet-Frontend>
- User Stories : `../FrontEnd/User Stories – Media Explorer.md`
- Plan de commits détaillé : `../FrontEnd/Plan de commits – Media Explorer.md`
- Synthèse du projet : `../FrontEnd/Synthèse du projet – Media Explorer.md`
- Spécifications officielles : `../FrontEnd/Spécifications du projet – Media Explorer.md`
- Grille de correction : `../FrontEnd/grille_correction.md`
