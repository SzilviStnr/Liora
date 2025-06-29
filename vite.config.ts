import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  define: {
    // Ensure single React instance
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});