import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hosted at the domain root on Netlify (3dartist.dev)
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
});
