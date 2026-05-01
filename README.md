# Media Explorer

Application web de recherche et consultation de livres, basée sur l'API publique OpenLibrary. Elle permet de chercher des ouvrages, de consulter leur fiche détaillée et de gérer une liste de favoris persistée localement.

Projet réalisé dans le cadre du module FrontEnd au CPNV, 4e trimestre, 2e année CFC informaticien.

## Sommaire

1. Fonctionnalités
2. Stack technique
3. Prérequis
4. Installation
5. Lancement
6. Build de production
7. Structure du projet
8. API OpenLibrary
9. Routes
10. Gestion d'état
11. Conventions de code
12. Auteur

## Fonctionnalités

- Recherche d'ouvrages par titre, auteur ou sujet
- Résultats affichés en grille responsive
- Tri par pertinence, titre ou année
- Filtre par année minimale
- Pagination par bouton "Charger plus"
- Fiche détaillée avec couverture grand format, métadonnées, description, sujets
- Lien direct vers la fiche OpenLibrary
- Liste de favoris persistée en localStorage
- Compteur de favoris dans la barre de navigation
- Gestion explicite des états chargement, erreur, vide
- Page 404 pour les routes inconnues
- Interface responsive desktop et mobile
- Transition de fondu entre les pages

## Stack technique

| Catégorie     | Outil           | Version |
|---------------|-----------------|---------|
| Framework     | Vue.js          | 3.x     |
| API style     | Options API     |         |
| Routage       | Vue Router      | 4.x     |
| État global   | Pinia           | 2.x     |
| Requêtes HTTP | Axios           |         |
| Styles        | Tailwind CSS    | 4.x     |
| Build         | Vite            | 5.x     |
| Police        | System UI stack |         |

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur
- Un navigateur récent (Chrome, Firefox, Safari, Edge)

## Installation

```bash
git clone <url-du-depot>
cd media-explorer
npm install ou npm install --force (en cas de problème)
npm run dev
```

## Lancement

Mode développement avec hot reload sur http://localhost:5173 :

```bash
npm run dev
```

## Build de production

Génère un build optimisé dans `dist/` :

```bash
npm run build
```

Prévisualiser le build localement :

```bash
npm run preview
```

## Structure du projet

```
media-explorer/
├── public/                  Fichiers statiques
├── src/
│   ├── assets/styles/
│   │   └── main.css         Styles globaux et tokens Tailwind
│   ├── components/          Composants réutilisables
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── BookCard.vue
│   │   ├── BookList.vue
│   │   ├── SearchBar.vue
│   │   ├── FilterBar.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── ErrorMessage.vue
│   │   └── EmptyState.vue
│   ├── views/               Pages de l'application
│   │   ├── HomeView.vue
│   │   ├── SearchView.vue
│   │   ├── DetailView.vue
│   │   ├── FavoritesView.vue
│   │   └── NotFoundView.vue
│   ├── router/
│   │   └── index.js         Configuration des routes
│   ├── stores/
│   │   ├── books.js         Recherche, pagination, tri, filtres
│   │   └── favorites.js     CRUD favoris et persistance
│   ├── services/
│   │   └── openLibrary.js   Client Axios pour OpenLibrary
│   ├── App.vue              Composant racine
│   └── main.js              Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

## API OpenLibrary

L'application consomme trois endpoints publics d'OpenLibrary, sans clé d'API.

| Endpoint                                          | Usage                  |
|---------------------------------------------------|------------------------|
| `GET /search.json?q={query}&page={n}&limit=20`    | Recherche paginée      |
| `GET /works/{id}.json`                            | Détails d'un livre     |
| `GET /authors/{id}.json`                          | Nom d'un auteur        |
| `GET covers.openlibrary.org/b/id/{coverId}-{size}.jpg` | Couverture        |

Extrait de `src/services/openLibrary.js` :

```javascript
import axios from 'axios'

const api = axios.create({ baseURL: 'https://openlibrary.org' })

export async function searchBooks(query, page = 1) {
  const { data } = await api.get('/search.json', {
    params: { q: query, page, limit: 20 }
  })
  return data
}

export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}
```

Documentation officielle : https://openlibrary.org/developers/api

## Routes

| Chemin             | Nom        | Composant       | Description           |
|--------------------|------------|-----------------|-----------------------|
| `/`                | home       | HomeView        | Accueil avec hero     |
| `/search`          | search     | SearchView      | Recherche et résultats|
| `/book/:id`        | detail     | DetailView      | Fiche d'un livre      |
| `/favorites`       | favorites  | FavoritesView   | Liste des favoris     |
| `/:pathMatch(.*)*` | not-found  | NotFoundView    | 404                   |

Le titre de l'onglet du navigateur est mis à jour automatiquement à chaque navigation.

## Gestion d'état

Deux stores Pinia partagés entre les composants.

`useBooksStore` dans `src/stores/books.js`
- État : `query`, `results`, `total`, `page`, `loading`, `loadingMore`, `error`, `sortBy`, `minYear`
- Computed : `filteredResults`, `hasMore`
- Actions : `search(q)`, `loadMore()`

`useFavoritesStore` dans `src/stores/favorites.js`
- État : `items`
- Computed : `count`
- Getters : `isFavorite(id)`
- Actions : `add(book)`, `remove(id)`, `toggle(book)`
- Persistance automatique en localStorage à chaque mutation

## Conventions de code

- Indentation 2 espaces
- Composants nommés en PascalCase, fichiers `.vue`
- Une vue par route, dans `src/views/`
- Composants réutilisables dans `src/components/`
- Pas de logique métier dans les composants, déléguée aux stores
- Pas d'appel API direct depuis un composant, passe par `src/services/openLibrary.js`
- Classes Tailwind utilitaires, complétées par `.btn`, `.btn-ghost`, `.btn-danger` dans `main.css`
