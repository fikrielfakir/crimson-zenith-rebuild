import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LARAVEL_API = "https://api.thejourney-ma.org";
const LOCAL_API = "http://localhost:3001";

// On Replit (REPL_ID is set) route /api to the local Express server.
// Locally (no REPL_ID) fall back to the external Laravel API so the
// frontend works without needing a local backend process.
const IS_REPLIT = !!process.env.REPL_ID;
const API_PROXY_TARGET = IS_REPLIT ? LOCAL_API : LARAVEL_API;

const PROD_API_BASE = "https://api.thejourney-ma.org";

export default defineConfig(({ mode }: { mode: string }) => ({
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(mode === "production" ? PROD_API_BASE : ""),
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@tanstack/react-query", "framer-motion"],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["core-js", "framer-motion"],
    esbuildOptions: {
      sourcemap: false,
      logOverride: { "invalid-source-map": "silent" },
      target: "es2020",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true as const,
    hmr: (process.env.REPL_SLUG || process.env.REPL_ID)
      ? { clientPort: 443, protocol: "wss", host: process.env.REPLIT_DEV_DOMAIN }
      : true,
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
    proxy: {
      // ── More-specific Laravel routes MUST come before the generic "/api" ──
      // Vite processes proxy entries in insertion order; the first match wins.
      // If "/api" appeared first it would swallow every "/api/admin/media" and
      // "/api/media" request before the specific Laravel rules could fire.
      "/api/admin/media": {
        target: LARAVEL_API,
        changeOrigin: true,
        secure: false,
        configure: (proxy: any) => {
          proxy.on("proxyReq", (proxyReq: any, req: any) => {
            proxyReq.setHeader("Origin", "https://thejourney-ma.org");
            proxyReq.setHeader("Referer", "https://thejourney-ma.org/");
            const auth = req.headers["authorization"];
            if (auth) proxyReq.setHeader("Authorization", auth);
            const cookie = req.headers["cookie"];
            if (cookie) proxyReq.setHeader("Cookie", cookie);
          });
        },
      },
      "/api/media": {
        target: LARAVEL_API,
        changeOrigin: true,
        secure: false,
        configure: (proxy: any) => {
          proxy.on("proxyReq", (proxyReq: any, req: any) => {
            proxyReq.setHeader("Origin", "https://thejourney-ma.org");
            const auth = req.headers["authorization"];
            if (auth) proxyReq.setHeader("Authorization", auth);
          });
        },
      },
      // ── Generic catch-all — goes to Express (3001) on Replit, external Laravel elsewhere ──
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT,
        configure: (proxy: any) => {
          proxy.on("proxyReq", (proxyReq: any, req: any) => {
            const auth = req.headers["authorization"];
            if (auth) proxyReq.setHeader("Authorization", auth);
            const cookie = req.headers["cookie"];
            if (cookie) proxyReq.setHeader("Cookie", cookie);
            if (!IS_REPLIT) {
              proxyReq.setHeader("Origin", "https://thejourney-ma.org");
              proxyReq.setHeader("Referer", "https://thejourney-ma.org/");
            }
          });
          proxy.on("error", (err: any, _req: any, res: any) => {
            const target = IS_REPLIT ? "local API (3001)" : "external API";
            console.error("[proxy] " + target + " unavailable:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "API unavailable - please try again in a moment." }));
            }
          });
        },
      },
      "/uploads": {
        target: LARAVEL_API,
        changeOrigin: true,
        secure: false,
      },
      "/storage": {
        target: LARAVEL_API,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    {
      // Handle Focus-Section settings locally
      name: "handle-focus-section",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          if (
            !url.startsWith("/api/cms/focus-section") &&
            !url.startsWith("/api/admin/cms/focus-section")
          ) {
            return next();
          }
          const fs = await import("fs/promises");
          const pathMod = await import("path");
          const settingsFile = pathMod.resolve(__dirname, "public/focus-section-settings.json");
          const DEFAULT = {
            id: "default",
            title: "Our Focus",
            subtitle: "Tourism, Culture, Entertainment",
            is_active: true,
          };
          async function readSettings(): Promise<any> {
            try { return JSON.parse(await fs.readFile(settingsFile, "utf-8")); }
            catch { return DEFAULT; }
          }
          async function writeSettings(data: any) {
            await fs.mkdir(pathMod.dirname(settingsFile), { recursive: true });
            await fs.writeFile(settingsFile, JSON.stringify(data, null, 2));
          }
          if (req.method === "GET") {
            const settings = await readSettings();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(settings));
            return;
          }
          if (req.method === "PUT") {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk);
              const body = JSON.parse(Buffer.concat(chunks).toString());
              const existing = await readSettings();
              const updated = { ...existing, ...body, id: "default" };
              await writeSettings(updated);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(updated));
              console.log("[focus-section] Settings saved");
            } catch (err) {
              console.error("[focus-section] Save error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Save failed" }));
            }
            return;
          }
          next();
        });
      },
    },
    {
      // Handle i18n locale file read/write locally
      name: "handle-i18n-locale",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          const match = url.match(/^\/api\/admin\/i18n\/([^?/]+)/);
          if (!match) return next();
          const section = match[1];
          const LANGS = ["en", "fr", "ar", "es"];
          const pathMod = await import("path");
          const fs = await import("fs/promises");
          if (req.method === "GET") {
            const result: Record<string, any> = {};
            for (const lang of LANGS) {
              const file = pathMod.resolve(__dirname, "src/i18n/locales/" + lang + ".json");
              try {
                const raw = JSON.parse(await fs.readFile(file, "utf-8"));
                result[lang] = raw[section] ?? {};
              } catch { result[lang] = {}; }
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
          }
          if (req.method === "PUT") {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk);
              const updates: Record<string, Record<string, string>> = JSON.parse(Buffer.concat(chunks).toString());
              for (const lang of LANGS) {
                if (!updates[lang]) continue;
                const file = pathMod.resolve(__dirname, "src/i18n/locales/" + lang + ".json");
                try {
                  const raw = JSON.parse(await fs.readFile(file, "utf-8"));
                  raw[section] = { ...(raw[section] ?? {}), ...updates[lang] };
                  await fs.writeFile(file, JSON.stringify(raw, null, 2) + "\n", "utf-8");
                } catch (e) { console.error("[i18n] Error updating " + lang + ".json:", e); }
              }
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Saved" }));
            } catch (err) {
              console.error("[i18n] Save error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Save failed" }));
            }
            return;
          }
          next();
        });
      },
    },
    {
      // Handle Legal Pages locally
      name: "handle-legal-pages",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          const publicMatch = url.match(/^\/api\/cms\/legal\/([^?/]+)/);
          const adminMatch  = url.match(/^\/api\/admin\/cms\/legal\/([^?/]+)/);
          if (!publicMatch && !adminMatch) return next();

          const fs = await import("fs/promises");
          const pathMod = await import("path");
          const storeFile = pathMod.resolve(__dirname, "public/legal-pages.json");

          async function readStore(): Promise<Record<string, any>> {
            try { return JSON.parse(await fs.readFile(storeFile, "utf-8")); }
            catch { return {}; }
          }
          async function writeStore(data: Record<string, any>) {
            await fs.mkdir(pathMod.dirname(storeFile), { recursive: true });
            await fs.writeFile(storeFile, JSON.stringify(data, null, 2));
          }

          const pageKey = (adminMatch?.[1] ?? publicMatch![1]).split("?")[0];

          if (req.method === "GET") {
            const store = await readStore();
            const entry = store[pageKey] ?? { pageKey, content: "" };
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(entry));
            return;
          }

          if (req.method === "PUT" && adminMatch) {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk);
              const body = JSON.parse(Buffer.concat(chunks).toString());
              const store = await readStore();
              store[pageKey] = { ...(store[pageKey] ?? {}), ...body, pageKey };
              await writeStore(store);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(store[pageKey]));
              console.log("[legal-pages] Saved \"" + pageKey + "\"");
            } catch (err) {
              console.error("[handle-legal-pages] Save error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Failed to save legal page" }));
            }
            return;
          }

          next();
        });
      },
    },
    {
      // Handle Cookie Consent settings locally
      name: "handle-cookie-settings",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          if (
            !url.startsWith("/api/cms/cookie-settings") &&
            !url.startsWith("/api/admin/cms/cookie-settings")
          ) {
            return next();
          }
          const fs = await import("fs/promises");
          const pathMod = await import("path");
          const settingsFile = pathMod.resolve(__dirname, "public/cookie-settings.json");
          const DEFAULT = {
            enabled: true,
            delay: 1500,
            title: "We use cookies to enhance your experience",
            description: "Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.",
            categories: [
              { key: "necessary", label: "Necessary Cookies", description: "Required for basic site functionality", enabled: true, locked: true },
              { key: "functional", label: "Functional Cookies", description: "Remember your preferences and settings", enabled: true, locked: false },
              { key: "analytics", label: "Analytics Cookies", description: "Help us understand how our website is being used", enabled: true, locked: false },
              { key: "marketing", label: "Marketing Cookies", description: "Personalized content and ads", enabled: true, locked: false },
            ],
          };
          async function readSettings(): Promise<any> {
            try { return JSON.parse(await fs.readFile(settingsFile, "utf-8")); }
            catch { return DEFAULT; }
          }
          async function writeSettings(data: any) {
            await fs.mkdir(pathMod.dirname(settingsFile), { recursive: true });
            await fs.writeFile(settingsFile, JSON.stringify(data, null, 2));
          }
          if (req.method === "GET") {
            const settings = await readSettings();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(settings));
            return;
          }
          if (req.method === "PUT") {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk);
              const body = JSON.parse(Buffer.concat(chunks).toString());
              const existing = await readSettings();
              const updated = { ...existing, ...body };
              await writeSettings(updated);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(updated));
            } catch (err) {
              console.error("[cookie-settings] Error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Failed to save" }));
            }
            return;
          }
          next();
        });
      },
    },
    {
      name: "handle-static-media",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          const isGet = req.method === "GET" && url.startsWith("/api/cms/static-media");
          const isPut = req.method === "PUT" && url.startsWith("/api/admin/cms/static-media");
          if (!isGet && !isPut) return next();
          const staticMediaFile = path.resolve(__dirname, "public/static-media.json");
          const readData = async () => {
            try { return JSON.parse(await fs.readFile(staticMediaFile, "utf-8")); }
            catch { return {}; }
          };
          if (isGet) {
            const data = await readData();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return;
          }
          if (isPut) {
            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(chunk);
              const body = JSON.parse(Buffer.concat(chunks).toString());
              const existing = await readData();
              const merged = { ...existing, ...body };
              await fs.writeFile(staticMediaFile, JSON.stringify(merged, null, 2));
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(merged));
            } catch (err) {
              console.error("[static-media] Error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Failed to save" }));
            }
            return;
          }
        });
      },
    },
    {
      // Handle auto-translate only
      name: "handle-auto-translate",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req.url ?? "";
          if (req.method !== "POST" || !url.startsWith("/api/admin/translations/auto-translate")) {
            return next();
          }
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const { texts, targetLanguage } = body;
            if (!texts || !Array.isArray(texts) || !targetLanguage) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Missing required fields" }));
              return;
            }
            const langMap: Record<string, string> = { ar: "ar", fr: "fr", es: "es" };
            const targetLang = langMap[targetLanguage];
            if (!targetLang) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Unsupported language" }));
              return;
            }
            async function translateChunk(text: string): Promise<string> {
              const apiUrl = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|" + targetLang;
              const apiRes = await fetch(apiUrl);
              const data = await apiRes.json() as any;
              return data?.responseStatus === 200 ? (data.responseData?.translatedText ?? text) : text;
            }
            async function translateLongText(value: string): Promise<string> {
              const LIMIT = 450;
              if (value.length <= LIMIT) return translateChunk(value);
              const paragraphs = value.split(/\n\n/);
              const out: string[] = [];
              for (const para of paragraphs) {
                if (!para.trim()) { out.push(para); continue; }
                if (para.length <= LIMIT) { out.push(await translateChunk(para)); continue; }
                const lines = para.split("\n");
                const lineOut: string[] = [];
                for (const line of lines) {
                  if (!line.trim()) { lineOut.push(line); continue; }
                  if (line.length <= LIMIT) { lineOut.push(await translateChunk(line)); continue; }
                  const segs = line.match(/.{1,450}(?:\s|$)/g) ?? [line];
                  const segOut: string[] = [];
                  for (const seg of segs) segOut.push(await translateChunk(seg.trim()));
                  lineOut.push(segOut.join(" "));
                }
                out.push(lineOut.join("\n"));
              }
              return out.join("\n\n");
            }
            const results: Record<string, string> = {};
            for (const { key, value: text } of texts as Array<{ key: string; value: string }>) {
              if (!text?.trim()) { results[key] = ""; continue; }
              results[key] = await translateLongText(text);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results }));
          } catch (err) {
            console.error("[auto-translate] Error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Translation failed" }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
