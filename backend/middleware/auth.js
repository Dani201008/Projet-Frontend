/**
 * Fichier  : backend/middleware/auth.js
 * Auteur   : Samuel
 * Rôle     : Middleware Express qui vérifie le JWT et alimente req.user.
 * Créé le  : 01.06.2026
 * Modifié  : 01.06.2026
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production'

/**
 * Vérifie qu'un token JWT valide est présent dans le header Authorization.
 * En cas de succès, place l'utilisateur décodé dans req.user.
 */
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token d\'authentification manquant' })
    }

    // "Bearer <token>" → on enlève les 7 premiers caractères.
    const token = authHeader.substring(7)

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré' })
    }
}
