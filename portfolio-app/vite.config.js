import { defineConfig } from 'vite'

// GitHub Pages serves this repo from https://<user>.github.io/youareintherightplace/,
// so the production build must be rooted at that subpath or every asset 404s.
// Keyed off `command` rather than process.env.NODE_ENV, which only happens to be
// set during `vite build`. The deploy workflow re-checks this against the repo name.
const REPO_BASE = '/youareintherightplace/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  server: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Single bundle keeps the GitHub Pages deployment simple.
        inlineDynamicImports: true,
        format: 'es',
      },
    },
  },
}))
