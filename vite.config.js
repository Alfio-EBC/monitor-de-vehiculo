<<<<<<< HEAD
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
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa'; 

export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    VitePWA({ 
      registerType: 'autoUpdate', 
      manifest: {
        name: 'Sala de control',
        short_name: 'Simon Movilidad', 
        description: 'Control vehicular inteligente',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/favicon.svg', 
            sizes: '192x192',
            type: './imagenes/logo-simon-movilidad.svg'
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: './imagenes/logo-simon-movilidad.svg' 
          }
        ]
      }
    })
  ],
});
>>>>>>> 748dfd4d180ca989830d77def27ef9cd21944d62
