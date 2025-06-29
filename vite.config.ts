import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // 💡 EZ A LÉNYEG!
    port: 5174        // Megadhatod kézzel is, de ha nincs, akkor is működik
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

