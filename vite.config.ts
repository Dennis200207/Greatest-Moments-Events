import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/Greatest-Moments-Events/',
  plugins: [tailwindcss()],
});