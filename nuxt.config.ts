// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      endpoint: process.env.NODE_ENV === 'development' ? `${process.env.BASE_API_DEV}${process.env.API_PATH}`: `${process.env.BASE_API_PROD}${process.env.API_PATH}`,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    manifest: {
      name: 'myTunes',
      short_name: 'myTunes',
      description: 'myTunes by DWS.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png'
        }
      ]
    }
  },

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
})