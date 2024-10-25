import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      // Specify any external modules to avoid Vite bundling them inappropriately
      external: ['firebase/app', 'firebase/database'], 
    },
  },
});
