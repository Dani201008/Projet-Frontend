/**
 * Fichier  : backend/routes/favorites.js
 * Auteur   : Samuel
 * Rôle     : Routes de gestion des favoris par utilisateur (toutes protégées par JWT).
 * Créé le  : 01.06.2026
 * Modifié  : 01.06.2026
 */

import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Toutes les routes de favoris nécessitent d'être authentifié.
router.use(requireAuth)

/**
 * GET /api/favorites
 * Retourne tous les favoris de l'utilisateur connecté, du plus récent au plus ancien.
 */
router.get('/', (req, res, next) => {
    try {
        const rows = db.prepare(
            `SELECT book_id AS id, title, authors, year, cover_id AS coverId, added_at
             FROM favorites
             WHERE user_id = ?
             ORDER BY added_at DESC`
        ).all(req.user.id)

        // Les auteurs sont stockés en JSON (SQLite n'a pas de type array).
        const favorites = rows.map(row => ({
            ...row,
            authors: row.authors ? JSON.parse(row.authors) : []
        }))

        res.json({ favorites })
    } catch (err) {
        next(err)
    }
})

/**
 * POST /api/favorites
 * Body  : { id, title, authors, year, coverId }
 * Ajoute un livre aux favoris de l'utilisateur connecté.
 */
router.post('/', (req, res, next) => {
    try {
        const { id, title, authors, year, coverId } = req.body

        if (!id || !title) {
            return res.status(400).json({ error: 'Identifiant et titre du livre requis' })
        }

        // SQLite ne supporte pas les tableaux : on sérialise les auteurs en JSON.
        const authorsJson = JSON.stringify(authors || [])

        try {
            db.prepare(
                `INSERT INTO favorites (user_id, book_id, title, authors, year, cover_id)
                 VALUES (?, ?, ?, ?, ?, ?)`
            ).run(req.user.id, id, title, authorsJson, year || null, coverId || null)
        } catch (err) {
            // UNIQUE constraint failed : ce favori existe déjà pour cet utilisateur.
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(409).json({ error: 'Ce livre est déjà dans vos favoris' })
            }
            throw err
        }

        res.status(201).json({ ok: true })
    } catch (err) {
        next(err)
    }
})

/**
 * DELETE /api/favorites/:bookId
 * Retire un livre des favoris de l'utilisateur connecté.
 */
router.delete('/:bookId', (req, res, next) => {
    try {
        const result = db.prepare(
            'DELETE FROM favorites WHERE user_id = ? AND book_id = ?'
        ).run(req.user.id, req.params.bookId)

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Favori introuvable' })
        }

        res.json({ ok: true })
    } catch (err) {
        next(err)
    }
})

export default router
