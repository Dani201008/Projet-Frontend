/**
 * Fichier  : backend/routes/auth.js
 * Auteur   : Samuel
 * Rôle     : Routes d'authentification : register, login, reset-password, me.
 * Créé le  : 01.06.2026
 * Modifié  : 04.06.2026
 */

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
const JWT_EXPIRES_IN = '7d'

/**
 * Génère un JWT contenant les infos publiques de l'utilisateur.
 * Le mot de passe (hashé) n'est jamais inclus.
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )
}

/**
 * POST /api/auth/register
 * Body    : { name, email, password }
 * Retour  : { token, user: { id, name, email } }
 */
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // Validation basique côté serveur.
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nom, email et mot de passe requis' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' })
        }

        // Vérifie qu'aucun compte n'utilise déjà cet email.
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
        if (existing) {
            return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })
        }

        // Hash bcrypt avec 10 rounds (bon compromis vitesse / sécurité).
        const passwordHash = await bcrypt.hash(password, 10)

        const result = db.prepare(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
        ).run(name, email, passwordHash)

        const user = { id: result.lastInsertRowid, name, email }
        const token = generateToken(user)

        res.status(201).json({ token, user })
    } catch (err) {
        next(err)
    }
})

/**
 * POST /api/auth/login
 * Body    : { email, password }
 * Retour  : { token, user: { id, name, email } }
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' })
        }

        const row = db.prepare(
            'SELECT id, name, email, password_hash FROM users WHERE email = ?'
        ).get(email)

        // Même message en cas d'email inconnu ou mot de passe faux,
        // pour ne pas révéler l'existence d'un compte.
        if (!row) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
        }

        const valid = await bcrypt.compare(password, row.password_hash)
        if (!valid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
        }

        const user = { id: row.id, name: row.name, email: row.email }
        const token = generateToken(user)

        res.json({ token, user })
    } catch (err) {
        next(err)
    }
})

/**
 * POST /api/auth/reset-password
 * Réinitialisation simplifiée : on retrouve le compte par email et on remplace le mot de passe.
 * (Projet scolaire : pas de lien de vérification par email. En production, on enverrait
 * un lien à usage unique plutôt que d'accepter un nouveau mot de passe directement.)
 * Body   : { email, password }
 * Retour : { token, user }
 */
router.post('/reset-password', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et nouveau mot de passe requis' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' })
        }

        const row = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(email)
        if (!row) {
            return res.status(404).json({ error: 'Aucun compte associé à cet email' })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, row.id)

        const user = { id: row.id, name: row.name, email: row.email }
        const token = generateToken(user)

        res.json({ token, user })
    } catch (err) {
        next(err)
    }
})

/**
 * GET /api/auth/me
 * Retourne l'utilisateur courant (décodé depuis le JWT).
 * Utilisé pour vérifier que la session est toujours valide.
 */
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user })
})

export default router
