import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT,
      },
      "/storage": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT,
      },
    },
  },
  plugins: [
    react(),
    {
      // Intercept GET /api/cms/media/:id - check local uploads first
      name: "serve-cms-media-by-id",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "GET") return next();
          const url: string = req.url ?? "";
          const match = url.match(/^\/api\/cms\/media\/(\d+)/);
          if (!match) return next();
          const id = parseInt(match[1], 10);
          try {
            const fs = await import("fs/promises");
            const pathMod = await import("path");
            const uploadsDir = pathMod.resolve(__dirname, "public/uploads");
            const indexFile = pathMod.join(uploadsDir, "media-index.json");
            let items: any[] = [];
            try { items = JSON.parse(await fs.readFile(indexFile, "utf-8")); } catch {}
            const entry = items.find((x: any) => x.id === id);
            if (!entry) return next();
            const filePath = pathMod.join(uploadsDir, entry.fileName);
            let binary: Buffer;
            try { binary = await fs.readFile(filePath); } catch { return next(); }
            const ext = entry.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
            const mimeMap: Record<string, string> = {
              jpg: "image/jpeg", jpeg: "image/jpeg",
              png: "image/png", gif: "image/gif", webp: "image/webp",
              svg: "image/svg+xml",
            };
            const mime = mimeMap[ext] ?? "image/jpeg";
            res.statusCode = 200;
            res.setHeader("Content-Type", mime);
            res.setHeader("Cache-Control", "public, max-age=3600");
            res.end(binary);
          } catch (err) {
            console.error("[cms-media] Error:", err);
            next();
          }
        });
      },
    },
    {
      // Intercept GET /api/media/{id} - check local uploads first
      name: "serve-media-binary",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "GET" || !req.url?.startsWith("/api/media/")) return next();
          const id = req.url.replace(/^\/api\/media\//, "").split("?")[0];
          if (!id) return next();
          try {
            const fs = await import("fs/promises");
            const pathMod = await import("path");
            const uploadsDir = pathMod.resolve(__dirname, "public/uploads");
            let localFile: string | null = null;
            try {
              const files = await fs.readdir(uploadsDir);
              const found = files.find((f) => f.startsWith(id + "."));
              if (found) localFile = pathMod.join(uploadsDir, found);
            } catch {}
            if (localFile) {
              const ext = localFile.split(".").pop() ?? "jpg";
              const mimeMap: Record<string, string> = {
                jpg: "image/jpeg", jpeg: "image/jpeg",
                png: "image/png", gif: "image/gif", webp: "image/webp",
              };
              const mime = mimeMap[ext] ?? "image/jpeg";
              const binary = await fs.readFile(localFile);
              res.statusCode = 200;
              res.setHeader("Content-Type", mime);
              res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
              res.end(binary);
              return;
            }
            next();
          } catch (err) {
            console.error("[serve-media-binary] Error:", err);
            next();
          }
        });
      },
    },
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
    {
      // Handle image uploads locally - intercepts POST /api/admin/upload-image
      // before the proxy so it works in both local dev and on Replit.
      name: "handle-upload-image",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "POST" || req.url !== "/api/admin/upload-image") {
            return next();
          }
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const imageData: string = body.imageData ?? "";
            const folder: string = body.folder ?? "misc";

            if (!imageData) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "No imageData provided" }));
              return;
            }

            const commaIdx = imageData.indexOf(",");
            if (!imageData.startsWith("data:") || commaIdx < 0) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Invalid imageData format" }));
              return;
            }

            const fs = await import("fs/promises");
            const pathMod = await import("path");
            const crypto = await import("crypto");

            const header = imageData.substring(5, commaIdx);
            const mime = header.split(";")[0];
            const rawExt = mime.split("/")[1] ?? "png";
            const ext = rawExt === "jpeg" ? "jpg" : rawExt === "svg+xml" ? "svg" : rawExt;
            const base64Data = imageData.substring(commaIdx + 1);
            const binary = Buffer.from(base64Data, "base64");
            const id = (crypto as any).randomUUID();
            const filename = id + "." + ext;
            const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "_");
            const uploadsDir = pathMod.resolve(__dirname, "public/uploads/" + safeFolder);
            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(pathMod.join(uploadsDir, filename), binary);
            const url = "/uploads/" + safeFolder + "/" + filename;

            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url }));
            console.log("[upload-image] Saved: " + url);
          } catch (err) {
            console.error("[upload-image] Error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Upload failed" }));
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
