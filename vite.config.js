/**
 * Fichier  : vite.config.js
 * Auteur   : Samuel
 * Rôle     : Configuration de Vite (plugins Vue et Tailwind, alias @ vers src).
 * Créé le  : 08.05.2026
 * Modifié  : 04.06.2026
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
