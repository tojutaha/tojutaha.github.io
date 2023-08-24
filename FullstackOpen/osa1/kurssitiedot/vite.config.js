import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://tojutaha.github.io/FullstackOpen/osa1/kurssitiedot',
  plugins: [react()],
})
