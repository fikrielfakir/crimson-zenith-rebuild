import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Rewrites Set-Cookie headers so they work in the local HTTP dev environment:
 *   - Strips the `Secure` flag  (http://localhost cannot store Secure cookies)
 *   - Rewrites `Domain` to `localhost`
 *   - Downgrades `SameSite=None` → `SameSite=Lax`
 */
function patchCookies(proxyRes: any) {
  const raw = proxyRes.headers["set-cookie"];
  if (!raw) return;
  proxyRes.headers["set-cookie"] = (Array.isArray(raw) ? raw : [raw]).map(
    (cookie: string) =>
      cookie
        .replace(/;\s*Secure/gi, "")
        .replace(/;\s*Domain=[^;]*/gi, "; Domain=localhost")
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
  );
}

// ---------------------------------------------------------------------------
// Local Laravel API (port 8000) — used for ALL routes in development.
// The local API has StartSession + Sanctum token auth working correctly.
//
// To switch back to the live production API once backend changes are deployed:
//   1. Change LOCAL_API_TARGET to 'https://api.thejourney-ma.org'
//   2. Replace the headers block with the production Origin/Referer spoof
//   3. Remove changeOrigin: false (set it to true for cross-origin)
// ---------------------------------------------------------------------------
const LOCAL_API_TARGET = "http://localhost:8000";

const localProxyOptions = {
  target: LOCAL_API_TARGET,
  changeOrigin: false,
  configure: (proxy: any) => {
    proxy.on("proxyRes", patchCookies);
  },
};

export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true as const,
    proxy: {
      "/api": localProxyOptions,
      "/sanctum": localProxyOptions,
    },
    watch: {
      ignored: [
        "**/.cache/**",
        "**/.bun/**",
        "**/node_modules/**",
        "**/laravel-api/**",
      ],
    },
    fs: {
      allow: [__dirname],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
