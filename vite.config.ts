import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const LOCAL_API = "http://localhost:8000";

const proxyOptions = {
  target: LOCAL_API,
  changeOrigin: true,
  secure: false,
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
