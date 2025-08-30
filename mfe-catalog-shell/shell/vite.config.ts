import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        catalog: process.env.VITE_CATALOG_URL || 'http://localhost:5174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5173,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
});
