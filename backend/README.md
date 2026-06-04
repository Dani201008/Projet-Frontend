# Backend Media Explorer

API Express + SQLite pour l'authentification (bcrypt + JWT) et les favoris par utilisateur.

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Édite .env pour mettre un vrai JWT_SECRET aléatoire.
```

## Lancement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3001`.

Le front-end (Vite sur `http://localhost:5173`) tape sur cette API via `src/services/api.js`.

## Endpoints

| Méthode  | URL                          | Auth | Body                               | Réponse                  |
|----------|------------------------------|------|------------------------------------|--------------------------|
| `GET`    | `/`                          | non  | –                                  | `{ status: 'ok' }`       |
| `POST`   | `/api/auth/register`         | non  | `{ name, email, password }`        | `{ token, user }`        |
| `POST`   | `/api/auth/login`            | non  | `{ email, password }`              | `{ token, user }`        |
| `GET`    | `/api/auth/me`               | oui  | –                                  | `{ user }`               |
| `GET`    | `/api/favorites`             | oui  | –                                  | `{ favorites: [...] }`   |
| `POST`   | `/api/favorites`             | oui  | `{ id, title, authors, year, coverId }` | `{ ok: true }`     |
| `DELETE` | `/api/favorites/:bookId`     | oui  | –                                  | `{ ok: true }`           |

## Stockage

- Base SQLite locale dans `data.db` (créée au premier lancement, gitignorée).
- Mots de passe hashés avec **bcryptjs** (10 rounds).
- Sessions sans état via **JWT** signé (durée 7 jours).
- Pas de table de migration : le schéma est créé automatiquement par `db.js`.

## Sécurité

- Les mots de passe ne sont jamais renvoyés au client, ni en clair ni hashés.
- Les messages d'erreur de login sont génériques (pas de distinction « email inconnu » vs « mot de passe faux »).
- Les contraintes `UNIQUE(user_id, book_id)` empêchent d'ajouter deux fois le même livre dans les favoris d'un même utilisateur.
- La suppression d'un utilisateur entraîne la suppression de ses favoris (`ON DELETE CASCADE`).
