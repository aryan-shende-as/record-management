import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // MapService (Port 5099)
      '/api/map': {
        target: 'http://localhost:5099',
        changeOrigin: true,
        secure: false,
      },
      // DepartmentService (Port 5000)
      '/api/department': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
