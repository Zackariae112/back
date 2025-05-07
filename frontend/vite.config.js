import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ Required for React to resolve /assets/ correctly
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    }
  }
});
