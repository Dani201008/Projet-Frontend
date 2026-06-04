/**
 * Fichier  : src/main.js
 * Auteur   : Samuel
 * Rôle     : Point d'entrée : crée l'app Vue, branche Pinia et le routeur, puis monte sur #app.
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'

import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
