import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './Products': './src/Products.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5174,
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
