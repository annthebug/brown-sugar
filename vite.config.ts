import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['pwa-192.svg', 'pwa-512.svg'],
      manifest: {
        name: 'Quest for the Perfect Bowl',
        short_name: 'Perfect Bowl',
        description: 'A gentle pixel RPG about Black Sugar, memory shards, and a glass matcha bowl.',
        theme_color: '#d8edf4',
        background_color: '#d8edf4',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'zh-Hant',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,jpeg,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        sourcemap: false,
      },
    }),
  ],
})
