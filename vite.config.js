import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: "/Team-Service/login", 
  resolve: {
    alias: {
      'date-fns/_lib/format/longFormatters': path.resolve(__dirname, 'node_modules/date-fns/_lib/format/longFormatters'),
    }
  },
  optimizeDeps: {
    include: ['date-fns']
  }
})
