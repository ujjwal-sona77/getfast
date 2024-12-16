import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        proxy: "https://server-getfast.onrender.com"
    },
  plugins: [react()],
})
