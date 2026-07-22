import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ai-frontend-relay-lab/',
  plugins: [react()],
});
