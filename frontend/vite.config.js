import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'frontend', // Root of your project
  build: {
    rollupOptions: {
      input: {
        course: resolve(__dirname, 'frontend/course/course.html'),
        other: resolve(__dirname, 'frontend/other-module/other.html'),
      },
    },
  },
})
