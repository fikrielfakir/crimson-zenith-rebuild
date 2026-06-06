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
        .replace(/;\s*Domain=[^;]*/gi, "")
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"),
  );
}

const LOCAL_API = "http://localhost:3001";

const localProxyOptions = {
  target: LOCAL_API,
  changeOrigin: true,
  secure: false,
  configure: (proxy: any) => {
    proxy.on("proxyRes", patchCookies);
    proxy.on("error", (err: any, _req: any, res: any) => {
      console.error("[proxy] Local API unavailable:", err.message);
      if (res && !res.headersSent) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Local API unavailable — please wait and try again.",
          }),
        );
      }
    });
  },
};

export default defineConfig(({ mode }: { mode: string }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    exclude: ["core-js"],
    esbuildOptions: {
      sourcemap: false,
      logOverride: { "invalid-source-map": "silent" },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true as const,
    hmr:
      process.env.REPL_SLUG || process.env.REPL_ID
        ? {
            clientPort: 443,
            protocol: "wss",
            host: process.env.REPLIT_DEV_DOMAIN,
          }
        : true,
    proxy: {
      "/api": localProxyOptions,
      "/sanctum": localProxyOptions,
      "/storage": localProxyOptions,
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
  plugins: [
    react(),
  ],
}));
