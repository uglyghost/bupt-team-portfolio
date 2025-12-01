import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 注意：这里的名称必须与您在 GitHub 上新建的仓库名称完全一致！
  // 建议使用 'bupt-team-portfolio' 避免覆盖您现有的 avionics-ai-lab 项目
  base: '/bupt-team-portfolio/',
})