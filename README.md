# Media Explorer

Application Vue.js de recherche de livres basée sur l'API publique OpenLibrary.
Projet réalisé dans le cadre du module FrontEnd au CPNV (4e trimestre, 2e année CFC informaticien).

## Fonctionnalités prévues

- Recherche de livres par titre, auteur ou sujet
- Affichage des résultats sous forme de grille
- Tri et filtrage des résultats
- Page de détail pour chaque livre
- Liste de favoris sauvegardée dans le navigateur
- Pages d'erreur et de chargement

## Technologies utilisées

- Vue.js 3 (Options API)
- Vue Router
- Pinia
- Axios
- Tailwind CSS
- Vite

## Prérequis

- Node.js 18 ou plus
- npm

## Installation

```bash
git clone <url-du-depot>
cd Projet-Frontend
npm install
npm run dev
```

L'application est accessible sur http://localhost:5173.

Pour générer le build de production :

```bash
npm run build
```

## Structure du projet

```
Projet-Frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/styles/main.css
│   ├── components/        composants réutilisables
│   ├── views/             une vue par route
│   ├── router/            configuration des routes
│   ├── services/          appels API (OpenLibrary)
│   ├── stores/            stores Pinia
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## API OpenLibrary

L'application utilise l'API publique d'OpenLibrary, qui ne demande pas de clé.

Endpoints utilisés :
- `/search.json?q=...` pour la recherche
- `/works/{id}.json` pour les détails d'un livre
- `/authors/{id}.json` pour le nom d'un auteur
- `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg` pour les couvertures

Les appels sont regroupés dans `src/services/openLibrary.js` (via Axios).

Documentation officielle : https://openlibrary.org/developers/api

## Routes

- `/` accueil
- `/search` recherche
- `/book/:id` détail d'un livre
- `/favorites` mes favoris
- 404 pour les autres URL

## Conventions

Voir le fichier `conventions` à la racine du projet.
