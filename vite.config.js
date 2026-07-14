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