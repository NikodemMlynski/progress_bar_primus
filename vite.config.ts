import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Nasłuchuje na wszystkich interfejsach sieciowych
    port: 5173, // Możesz zmienić na inny port
  },
});
