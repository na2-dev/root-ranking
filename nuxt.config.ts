// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // GitHub Pages設定
  nitro: {
    prerender: {
      routes: ['/']
    },
    // publicディレクトリのファイルを静的アセットとして含める
    publicAssets: [
      {
        baseURL: process.env.NODE_ENV === 'production' ? '/root-ranking/' : '/',
        dir: 'public',
        maxAge: 60 * 60 * 24 // 24時間キャッシュ
      }
    ],
    // リダイレクト設定
    routeRules: {
      '/root-ranking': { redirect: '/' },
      '/root-ranking/': { redirect: '/' }
    }
  },
  
  app: {
    baseURL: '/'
  }
})
