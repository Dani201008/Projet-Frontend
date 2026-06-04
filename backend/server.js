/**
 * Fichier  : backend/server.js
 * Auteur   : Samuel
 * Rôle     : Point d'entrée du backend Express : middlewares, routes, listen.
 * Créé le  : 01.06.2026
 * Modifié  : 04.06.2026
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import favoritesRoutes from './routes/favorites.js'

const app = express()
const PORT = process.env.PORT || 3001

// Autorise le front Vite quel que soit son port local : Vite glisse sur 5174, 5175…
// si 5173 est déjà pris, et un port en dur bloquerait alors les requêtes (erreur CORS).
app.use(cors({
    origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
    credentials: true
}))

// Parse les bodies JSON envoyés depuis le front.
app.use(express.json())

// Ping racine pour vérifier que le serveur tourne.
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'Media Explorer Backend' })
})

// Routes d'authentification : /api/auth/register, /login, /me.
app.use('/api/auth', authRoutes)

// Routes de favoris : toutes protégées par JWT.
app.use('/api/favorites', favoritesRoutes)

// Gestionnaire d'erreur global pour ne pas crasher le serveur.
app.use((err, req, res, next) => {
    console.error('Erreur serveur :', err)
    res.status(err.status || 500).json({
        error: err.message || 'Erreur serveur'
    })
})

app.listen(PORT, () => {
    console.log(`Backend Media Explorer en écoute sur http://localhost:${PORT}`)
})
