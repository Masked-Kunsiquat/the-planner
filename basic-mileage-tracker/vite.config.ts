import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import flowbiteReact from "flowbite-react/plugin/vite";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flowbiteReact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offline-cache',
            }
          }
        ]
      },
      manifest: {
        name: 'Mileage Tracker',
        short_name: 'M-Tracker',
        description: 'Basic mileage/fill-up tracker.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})