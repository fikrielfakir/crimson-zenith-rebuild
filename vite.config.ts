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
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"),
  );
}

const PROD_API = "https://api.thejourney-ma.org";

const proxyOptions = {
  target: PROD_API,
  changeOrigin: true,
  secure: true,
  // Spoof Origin/Referer so Sanctum's SANCTUM_STATEFUL_DOMAINS check passes
  headers: {
    Origin: "https://thejourney-ma.org",
    Referer: "https://thejourney-ma.org/",
  },
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
      "/api": proxyOptions,
      "/sanctum": proxyOptions,
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
