import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/ui',
  base: process.env.NODE_ENV === 'production' ? '/2048/' : '/',
  build: {
    outDir: '../../dist',
  },
}) 