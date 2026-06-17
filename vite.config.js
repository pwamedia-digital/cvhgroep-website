import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Bij `vite build` gebruiken we de GitHub Pages projectsubmap
// (https://pwaseys.github.io/cvhgroep-website/); lokaal blijft de
// dev-server gewoon op "/" draaien.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/cvhgroep-website/' : '/',
  plugins: [react(), tailwindcss()],
}))
