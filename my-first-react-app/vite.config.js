import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/My_First_React_Movie_App/',
    server: {
        host: true,  // Add this
        port: 5173
    }
})
