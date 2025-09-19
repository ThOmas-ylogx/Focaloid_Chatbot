/* eslint-disable import/no-unresolved */
// vite.config.js
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

console.log('VITE CONFIG LOADED! Using @tailwindcss/vite.');
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
