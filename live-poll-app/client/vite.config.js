import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configuration du proxy pour les appels API
    proxy: {
      // Toutes les requêtes commençant par /api seront redirigées
      '/api': {
        target: 'http://localhost:3001', // L'adresse de notre serveur backend Express
        changeOrigin: true, // Nécessaire pour les hôtes virtuels
        secure: false, // Ne pas rejeter les connexions sur des serveurs http
      },
    },
  },
})
