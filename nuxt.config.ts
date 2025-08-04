// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // GitHub Pages設定
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/root-ranking/' : '/'
  }
})
