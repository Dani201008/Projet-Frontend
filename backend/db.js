/**
 * Fichier  : backend/db.js
 * Auteur   : Samuel
 * Rôle     : Initialise la base SQLite et crée les tables users + favorites.
 * Créé le  : 01.06.2026
 * Modifié  : 01.06.2026
 */

import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Fichier de base SQLite : créé automatiquement au premier lancement.
const dbPath = path.join(__dirname, 'data.db')
const db = new Database(dbPath)

// Active les contraintes de clés étrangères (désactivées par défaut dans SQLite).
db.pragma('foreign_keys = ON')

// Mode WAL : écritures plus rapides et lecture possible pendant une écriture.
// Évite les erreurs "database is locked" quand on ouvre la base dans un outil
// pendant que le serveur tourne.
db.pragma('journal_mode = WAL')

// Table des utilisateurs : email unique, mot de passe hashé bcrypt.
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

// Table des favoris : un même livre ne peut apparaître qu'une fois par utilisateur.
// Suppression d'un utilisateur entraîne la suppression de ses favoris (CASCADE).
db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id TEXT NOT NULL,
        title TEXT NOT NULL,
        authors TEXT,
        year INTEGER,
        cover_id INTEGER,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`)

// Index pour accélérer l'historique des favoris d'un utilisateur,
// trié du plus récent au plus ancien (requête de la page Favoris).
db.exec(`
    CREATE INDEX IF NOT EXISTS idx_favorites_user
    ON favorites(user_id, added_at)
`)

export default db
