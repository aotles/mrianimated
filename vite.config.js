// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'mri_magnitude/mri_magnitude.html'),
        nested1: resolve(__dirname, 'resonance_scene/resonance.html'),
        nested2: resolve(__dirname, 'decay_concepts/decay_concepts.html'),
        nested3: resolve(__dirname, 'gradient_encoding/gradient_map.html')
      },
    },
  },
})