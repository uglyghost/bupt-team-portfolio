import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  // 注意：这里换成您的仓库名，前后都要有斜杠
  base: '/bupt-team-web/',
})