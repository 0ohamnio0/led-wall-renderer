import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/led-wall-renderer/',
})
