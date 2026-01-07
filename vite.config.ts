
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Shims process.env.API_KEY to satisfy the @google/genai SDK requirements.
    // Ensure you add API_KEY to your Vercel Project Environment Variables!
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000,
    host: true
  }
});
