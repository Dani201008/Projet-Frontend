# Media Explorer

Application Vue.js de recherche et de consultation de livres, basée sur l'API publique OpenLibrary.
Projet réalisé dans le cadre du module FrontEnd au CPNV (4e trimestre, 2e année CFC informaticien).

## Fonctionnalités

- Recherche par titre, auteur ou sujet
- Résultats en grille responsive
- Tri par pertinence, titre ou année
- Filtre par année minimale
- Pagination "Charger plus"
- Fiche détaillée d'un livre (couverture, métadonnées, description, sujets)
- Liste de favoris persistée dans le navigateur (localStorage)
- Compteur de favoris dans la barre de navigation
- Gestion des états chargement, erreur, vide
- Page 404 et transitions de fondu entre les pages

## Technologies

- Vue.js 3 (Options API)
- Vue Router 4
- Pinia 2
- Axios
- Tailwind CSS 4
- Vite 5

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

Pour générer la version de production :

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
│   ├── stores/            stores Pinia (recherche, favoris)
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## API OpenLibrary

L'application utilise l'API publique d'OpenLibrary, sans clé.

Endpoints utilisés :
- `/search.json?q=...&page=...&limit=...` — recherche paginée
- `/works/{id}.json` — détails d'un livre
- `/authors/{id}.json` — nom d'un auteur
- `https://covers.openlibrary.org/b/id/{cover_i}-{S|M|L}.jpg` — couverture

Les appels HTTP sont regroupés dans `src/services/openLibrary.js` (Axios).

Documentation officielle : https://openlibrary.org/developers/api

## Routes

- `/` accueil
- `/search` recherche
- `/book/:id` détail d'un livre
- `/favorites` mes favoris
- 404 pour toute autre URL

## Contributeurs

Projet réalisé en équipe Scrum (classe SI-CMI2a) :

- **Samuel Theytaz** — Scrum Master · routage, thème, authentification, backend
- **Dani Dordevic** — service OpenLibrary, gestion des états, stores Pinia, favoris
- **Timmy** — barre de recherche, résultats, fiche détaillée, tri / filtres, page favoris

## Conventions

Voir le fichier `conventions` à la racine du projet.
