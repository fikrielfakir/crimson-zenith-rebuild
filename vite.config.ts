import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true as const,
    proxy: {
      '/api': {
        target: 'https://api.thejourney-ma.org',
        changeOrigin: true,
        secure: true,
        // Spoof Origin/Referer so Sanctum's SANCTUM_STATEFUL_DOMAINS check passes
        headers: {
          Origin: 'https://thejourney-ma.org',
          Referer: 'https://thejourney-ma.org/',
        },
        // Rewrite cookie domains so the browser stores and resends them from localhost
        cookieDomainRewrite: { '*': 'localhost' },
      },
      '/sanctum': {
        target: 'https://api.thejourney-ma.org',
        changeOrigin: true,
        secure: true,
        headers: {
          Origin: 'https://thejourney-ma.org',
          Referer: 'https://thejourney-ma.org/',
        },
        cookieDomainRewrite: { '*': 'localhost' },
      },
    },
    watch: {
      ignored: [
        "**/.cache/**",
        "**/.bun/**",
        "**/node_modules/**",
        "**/laravel-api/**"
      ]
    },
    fs: {
      allow: [
        __dirname
      ]
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
