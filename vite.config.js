import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El backend mínimo (server/index.js, puerto 8787) corre como proceso Node
    // aparte — este proxy lo expone same-origin en dev para que el frontend
    // pueda llamar /api/scan-receipt sin lidiar con CORS.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
