import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ Important for Spring Boot static serving
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    }
  }
});
