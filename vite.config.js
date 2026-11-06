import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://demo4.traccar.org',
        changeOrigin: true,
        secure: false,
        // Opcional: si la API espera recibir la ruta limpia, puedes reescribirla o dejarla tal cual
      }
    }
  }
})