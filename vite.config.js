import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  base: '/Part-Out-Shark/',
  plugins: [react()],
  build: { outDir: "docs" }
})
