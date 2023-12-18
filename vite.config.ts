import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "andres-pradilla",
    project: "flight-planner-web-app"
  })],

  build: {
    sourcemap: true
  }
})