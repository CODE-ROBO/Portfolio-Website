import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Layer 06: For Gzip/Brotli compression, uncomment the plugin below after running: 
// npm install vite-plugin-compression -D
// import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // viteCompression({ algorithm: 'brotliCompress' }),
    // viteCompression({ algorithm: 'gzip' })
  ],
  build: {
    minify: 'esbuild', // Ensures fastest minimal build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Code Splitting for vendor libraries
        },
      },
    },
  },
});
