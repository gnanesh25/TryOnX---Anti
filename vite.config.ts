import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy Amazon CDN garment images to avoid canvas CORS errors
      '/img-proxy': {
        target: 'https://m.media-amazon.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ''),
        secure: false,
      },
      // Proxy Unsplash sample model images
      '/unsplash-proxy': {
        target: 'https://images.unsplash.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/unsplash-proxy/, ''),
        secure: false,
      },
    },
  },
})
