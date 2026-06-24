import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/myfirsthub/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three';
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react')) {
            return 'vendor';
          }
        }
      }
    }
  }
})