import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Protect Your Skin',
        short_name: 'UV Tracker',
        description: 'Real-time UV tracker for Victoria, Australia',
        theme_color: '#3EA72D',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="88" fill="%233EA72D"/><circle cx="96" cy="36" r="14" fill="%23fff"/><circle cx="140" cy="52" r="14" fill="%23fff"/><circle cx="152" cy="96" r="14" fill="%23fff"/><circle cx="140" cy="140" r="14" fill="%23fff"/><circle cx="96" cy="156" r="14" fill="%23fff"/><circle cx="52" cy="140" r="14" fill="%23fff"/><circle cx="40" cy="96" r="14" fill="%23fff"/><circle cx="52" cy="52" r="14" fill="%23fff"/></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="256" cy="256" r="235" fill="%233EA72D"/><circle cx="256" cy="80" r="37" fill="%23fff"/><circle cx="373" cy="139" r="37" fill="%23fff"/><circle cx="405" cy="256" r="37" fill="%23fff"/><circle cx="373" cy="373" r="37" fill="%23fff"/><circle cx="256" cy="432" r="37" fill="%23fff"/><circle cx="139" cy="373" r="37" fill="%23fff"/><circle cx="107" cy="256" r="37" fill="%23fff"/><circle cx="139" cy="139" r="37" fill="%23fff"/></svg>',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="88" fill="%233EA72D"/><circle cx="96" cy="36" r="14" fill="%23fff"/><circle cx="140" cy="52" r="14" fill="%23fff"/><circle cx="152" cy="96" r="14" fill="%23fff"/><circle cx="140" cy="140" r="14" fill="%23fff"/><circle cx="96" cy="156" r="14" fill="%23fff"/><circle cx="52" cy="140" r="14" fill="%23fff"/><circle cx="40" cy="96" r="14" fill="%23fff"/><circle cx="52" cy="52" r="14" fill="%23fff"/></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
