import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 Agregamos esta importación

export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    VitePWA({ 
      registerType: 'Simon Movilidad',
      manifest: {
        name: 'Sala de control',
        short_name: 'MiApp',
        description: 'Control vehicular inteligente',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/favicon.svg', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});