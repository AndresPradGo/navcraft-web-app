import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'andres-pradilla',
      project: 'navcraft-web-app',
    }),
    sentryVitePlugin({
      org: 'andres-pradilla',
      project: 'navcraft-web-app',
    }),
  ],

  build: {
    sourcemap: true,
  },

  server: {
    port: 5173,
  },
});
