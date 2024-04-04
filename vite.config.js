import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    // proxy: {
    //   // Proxying API requests
    //   '/api': {
    //     target: 'https://platform.altamirahrm.com', // The backend server you're proxying to
    //     changeOrigin: true, // Needed for virtual hosted sites
    //     //rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path; remove /api
    //   },
    //   // You can add other proxies here if needed
    // },
  }
})
