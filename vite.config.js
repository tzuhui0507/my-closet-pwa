import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 自動更新 Service Worker，讓使用者拿到最新版代碼
      registerType: 'autoUpdate',
      
      // 包含在 SW 快取中的靜態資源
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-icon.png'],
      
      manifest: {
        name: 'My AI Closet',
        short_name: 'AI Closet',
        description: '您的個人數位雲端衣櫥',
        // 設定與您的 index.css 主色一致，讓手機頂部狀態列過渡更美
        theme_color: '#faf7f5', 
        background_color: '#faf7f5',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // 讓 Android 圖示可以自動適應圓形或方形
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      // ⭐ 加入 Workbox 設定：實現真正的離線使用
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // 快取所有重要資源
        cleanupOutdatedCaches: true, // 自動清理舊版本快取
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ]
})