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

  modules: ['@pinia/nuxt'],
})