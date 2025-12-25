// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // ...other config
  resolve: {
    alias: {
      // Maps '@' to the absolute path of your 'src' folder
      '@': path.resolve(__dirname, './src'), 
    },
  },
});