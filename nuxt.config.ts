// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 静的サイト生成を有効化
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/', '/supply-analysis'],
      crawlLinks: true
    },
    // GitHub Pages用の設定
    output: {
      publicDir: '.output/public'
    }
  },
  
  // GitHub Pages設定
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/root-ranking/' : '/',
    buildAssetsDir: '_nuxt/'
  }
})
