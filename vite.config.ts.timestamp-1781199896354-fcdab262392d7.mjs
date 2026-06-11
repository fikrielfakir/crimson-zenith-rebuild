// vite.config.ts
import { defineConfig } from "file:///home/runner/workspace/node_modules/vite/dist/node/index.js";
import react from "file:///home/runner/workspace/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///home/runner/workspace/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var LARAVEL_API = "https://api.thejourney-ma.org";
var LOCAL_API = "http://localhost:3001";
var IS_REPLIT = !!process.env.REPL_ID;
var API_PROXY_TARGET = IS_REPLIT ? LOCAL_API : LARAVEL_API;
var PROD_API_BASE = "https://api.thejourney-ma.org";
var vite_config_default = defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(mode === "production" ? PROD_API_BASE : "")
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@tanstack/react-query", "framer-motion"]
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["core-js"],
    esbuildOptions: {
      sourcemap: false,
      logOverride: { "invalid-source-map": "silent" }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    allowedHosts: true,
    hmr: process.env.REPL_SLUG || process.env.REPL_ID ? { clientPort: 443, protocol: "wss", host: process.env.REPLIT_DEV_DOMAIN } : true,
    watch: {
      ignored: [
        "**/.cache/**",
        "**/.bun/**",
        "**/node_modules/**",
        "**/laravel-api/**"
      ]
    },
    fs: {
      allow: [__dirname]
    },
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const auth = req.headers["authorization"];
            if (auth) proxyReq.setHeader("Authorization", auth);
            const cookie = req.headers["cookie"];
            if (cookie) proxyReq.setHeader("Cookie", cookie);
            if (!IS_REPLIT) {
              proxyReq.setHeader("Origin", "https://thejourney-ma.org");
              proxyReq.setHeader("Referer", "https://thejourney-ma.org/");
            }
          });
          proxy.on("error", (err, _req, res) => {
            const target = IS_REPLIT ? "local API (3001)" : "external API";
            console.error("[proxy] " + target + " unavailable:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "API unavailable - please try again in a moment." }));
            }
          });
        }
      },
      "/uploads": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT
      },
      "/storage": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: !IS_REPLIT
      }
    }
  },
  plugins: [
    react(),
    {
      // Intercept GET /api/cms/media/:id - check local uploads first
      name: "serve-cms-media-by-id",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== "GET") return next();
          const url = req.url ?? "";
          const match = url.match(/^\/api\/cms\/media\/(\d+)/);
          if (!match) return next();
          const id = parseInt(match[1], 10);
          try {
            const fs = await import("fs/promises");
            const pathMod = await import("path");
            const uploadsDir = pathMod.resolve(__dirname, "public/uploads");
            const indexFile = pathMod.join(uploadsDir, "media-index.json");
            let items = [];
            try {
              items = JSON.parse(await fs.readFile(indexFile, "utf-8"));
            } catch {
            }
            const entry = items.find((x) => x.id === id);
            if (!entry) return next();
            const filePath = pathMod.join(uploadsDir, entry.fileName);
            let binary;
            try {
              binary = await fs.readFile(filePath);
            } catch {
              return next();
            }
            const ext = entry.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
            const mimeMap = {
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              png: "image/png",
              gif: "image/gif",
              webp: "image/webp",
              svg: "image/svg+xml"
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
      }
    },
    {
      // Intercept GET /api/media/{id} - check local uploads first
      name: "serve-media-binary",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== "GET" || !req.url?.startsWith("/api/media/")) return next();
          const id = req.url.replace(/^\/api\/media\//, "").split("?")[0];
          if (!id) return next();
          try {
            const fs = await import("fs/promises");
            const pathMod = await import("path");
            const uploadsDir = pathMod.resolve(__dirname, "public/uploads");
            let localFile = null;
            try {
              const files = await fs.readdir(uploadsDir);
              const found = files.find((f) => f.startsWith(id + "."));
              if (found) localFile = pathMod.join(uploadsDir, found);
            } catch {
            }
            if (localFile) {
              const ext = localFile.split(".").pop() ?? "jpg";
              const mimeMap = {
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                gif: "image/gif",
                webp: "image/webp"
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
      }
    },
    {
      // Handle Focus-Section settings locally
      name: "handle-focus-section",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          if (!url.startsWith("/api/cms/focus-section") && !url.startsWith("/api/admin/cms/focus-section")) {
            return next();
          }
          const fs = await import("fs/promises");
          const pathMod = await import("path");
          const settingsFile = pathMod.resolve(__dirname, "public/focus-section-settings.json");
          const DEFAULT = {
            id: "default",
            title: "Our Focus",
            subtitle: "Tourism, Culture, Entertainment",
            is_active: true
          };
          async function readSettings() {
            try {
              return JSON.parse(await fs.readFile(settingsFile, "utf-8"));
            } catch {
              return DEFAULT;
            }
          }
          async function writeSettings(data) {
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
              const chunks = [];
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
      }
    },
    {
      // Handle i18n locale file read/write locally
      name: "handle-i18n-locale",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          const match = url.match(/^\/api\/admin\/i18n\/([^?/]+)/);
          if (!match) return next();
          const section = match[1];
          const LANGS = ["en", "fr", "ar", "es"];
          const pathMod = await import("path");
          const fs = await import("fs/promises");
          if (req.method === "GET") {
            const result = {};
            for (const lang of LANGS) {
              const file = pathMod.resolve(__dirname, "src/i18n/locales/" + lang + ".json");
              try {
                const raw = JSON.parse(await fs.readFile(file, "utf-8"));
                result[lang] = raw[section] ?? {};
              } catch {
                result[lang] = {};
              }
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
          }
          if (req.method === "PUT") {
            try {
              const chunks = [];
              for await (const chunk of req) chunks.push(chunk);
              const updates = JSON.parse(Buffer.concat(chunks).toString());
              for (const lang of LANGS) {
                if (!updates[lang]) continue;
                const file = pathMod.resolve(__dirname, "src/i18n/locales/" + lang + ".json");
                try {
                  const raw = JSON.parse(await fs.readFile(file, "utf-8"));
                  raw[section] = { ...raw[section] ?? {}, ...updates[lang] };
                  await fs.writeFile(file, JSON.stringify(raw, null, 2) + "\n", "utf-8");
                } catch (e) {
                  console.error("[i18n] Error updating " + lang + ".json:", e);
                }
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
      }
    },
    {
      // Handle Legal Pages locally
      name: "handle-legal-pages",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          const publicMatch = url.match(/^\/api\/cms\/legal\/([^?/]+)/);
          const adminMatch = url.match(/^\/api\/admin\/cms\/legal\/([^?/]+)/);
          if (!publicMatch && !adminMatch) return next();
          const fs = await import("fs/promises");
          const pathMod = await import("path");
          const storeFile = pathMod.resolve(__dirname, "public/legal-pages.json");
          async function readStore() {
            try {
              return JSON.parse(await fs.readFile(storeFile, "utf-8"));
            } catch {
              return {};
            }
          }
          async function writeStore(data) {
            await fs.mkdir(pathMod.dirname(storeFile), { recursive: true });
            await fs.writeFile(storeFile, JSON.stringify(data, null, 2));
          }
          const pageKey = (adminMatch?.[1] ?? publicMatch[1]).split("?")[0];
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
              const chunks = [];
              for await (const chunk of req) chunks.push(chunk);
              const body = JSON.parse(Buffer.concat(chunks).toString());
              const store = await readStore();
              store[pageKey] = { ...store[pageKey] ?? {}, ...body, pageKey };
              await writeStore(store);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(store[pageKey]));
              console.log('[legal-pages] Saved "' + pageKey + '"');
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
      }
    },
    {
      // Handle Cookie Consent settings locally
      name: "handle-cookie-settings",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          if (!url.startsWith("/api/cms/cookie-settings") && !url.startsWith("/api/admin/cms/cookie-settings")) {
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
              { key: "marketing", label: "Marketing Cookies", description: "Personalized content and ads", enabled: true, locked: false }
            ]
          };
          async function readSettings() {
            try {
              return JSON.parse(await fs.readFile(settingsFile, "utf-8"));
            } catch {
              return DEFAULT;
            }
          }
          async function writeSettings(data) {
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
              const chunks = [];
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
      }
    },
    {
      // Handle auto-translate only
      name: "handle-auto-translate",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          if (req.method !== "POST" || !url.startsWith("/api/admin/translations/auto-translate")) {
            return next();
          }
          try {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const { texts, targetLanguage } = body;
            if (!texts || !Array.isArray(texts) || !targetLanguage) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Missing required fields" }));
              return;
            }
            const langMap = { ar: "ar", fr: "fr", es: "es" };
            const targetLang = langMap[targetLanguage];
            if (!targetLang) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Unsupported language" }));
              return;
            }
            async function translateChunk(text) {
              const apiUrl = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|" + targetLang;
              const apiRes = await fetch(apiUrl);
              const data = await apiRes.json();
              return data?.responseStatus === 200 ? data.responseData?.translatedText ?? text : text;
            }
            async function translateLongText(value) {
              const LIMIT = 450;
              if (value.length <= LIMIT) return translateChunk(value);
              const paragraphs = value.split(/\n\n/);
              const out = [];
              for (const para of paragraphs) {
                if (!para.trim()) {
                  out.push(para);
                  continue;
                }
                if (para.length <= LIMIT) {
                  out.push(await translateChunk(para));
                  continue;
                }
                const lines = para.split("\n");
                const lineOut = [];
                for (const line of lines) {
                  if (!line.trim()) {
                    lineOut.push(line);
                    continue;
                  }
                  if (line.length <= LIMIT) {
                    lineOut.push(await translateChunk(line));
                    continue;
                  }
                  const segs = line.match(/.{1,450}(?:\s|$)/g) ?? [line];
                  const segOut = [];
                  for (const seg of segs) segOut.push(await translateChunk(seg.trim()));
                  lineOut.push(segOut.join(" "));
                }
                out.push(lineOut.join("\n"));
              }
              return out.join("\n\n");
            }
            const results = {};
            for (const { key, value: text } of texts) {
              if (!text?.trim()) {
                results[key] = "";
                continue;
              }
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
      }
    },
    {
      // Handle image uploads locally - intercepts POST /api/admin/upload-image
      // before the proxy so it works in both local dev and on Replit.
      name: "handle-upload-image",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== "POST" || req.url !== "/api/admin/upload-image") {
            return next();
          }
          try {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const imageData = body.imageData ?? "";
            const folder = body.folder ?? "misc";
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
            const id = crypto.randomUUID();
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
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3J1bm5lci93b3Jrc3BhY2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuY29uc3QgTEFSQVZFTF9BUEkgPSBcImh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnXCI7XG5jb25zdCBMT0NBTF9BUEkgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiO1xuXG4vLyBPbiBSZXBsaXQgKFJFUExfSUQgaXMgc2V0KSByb3V0ZSAvYXBpIHRvIHRoZSBsb2NhbCBFeHByZXNzIHNlcnZlci5cbi8vIExvY2FsbHkgKG5vIFJFUExfSUQpIGZhbGwgYmFjayB0byB0aGUgZXh0ZXJuYWwgTGFyYXZlbCBBUEkgc28gdGhlXG4vLyBmcm9udGVuZCB3b3JrcyB3aXRob3V0IG5lZWRpbmcgYSBsb2NhbCBiYWNrZW5kIHByb2Nlc3MuXG5jb25zdCBJU19SRVBMSVQgPSAhIXByb2Nlc3MuZW52LlJFUExfSUQ7XG5jb25zdCBBUElfUFJPWFlfVEFSR0VUID0gSVNfUkVQTElUID8gTE9DQUxfQVBJIDogTEFSQVZFTF9BUEk7XG5cbmNvbnN0IFBST0RfQVBJX0JBU0UgPSBcImh0dHBzOi8vYXBpLnRoZWpvdXJuZXktbWEub3JnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH06IHsgbW9kZTogc3RyaW5nIH0pID0+ICh7XG4gIGRlZmluZToge1xuICAgIFwiaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMXCI6IEpTT04uc3RyaW5naWZ5KG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gUFJPRF9BUElfQkFTRSA6IFwiXCIpLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgICAgdWk6IFtcIkB0YW5zdGFjay9yZWFjdC1xdWVyeVwiLCBcImZyYW1lci1tb3Rpb25cIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFtcImNvcmUtanNcIl0sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICBsb2dPdmVycmlkZTogeyBcImludmFsaWQtc291cmNlLW1hcFwiOiBcInNpbGVudFwiIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogNTAwMCxcbiAgICBhbGxvd2VkSG9zdHM6IHRydWUgYXMgY29uc3QsXG4gICAgaG1yOiAocHJvY2Vzcy5lbnYuUkVQTF9TTFVHIHx8IHByb2Nlc3MuZW52LlJFUExfSUQpXG4gICAgICA/IHsgY2xpZW50UG9ydDogNDQzLCBwcm90b2NvbDogXCJ3c3NcIiwgaG9zdDogcHJvY2Vzcy5lbnYuUkVQTElUX0RFVl9ET01BSU4gfVxuICAgICAgOiB0cnVlLFxuICAgIHdhdGNoOiB7XG4gICAgICBpZ25vcmVkOiBbXG4gICAgICAgIFwiKiovLmNhY2hlLyoqXCIsXG4gICAgICAgIFwiKiovLmJ1bi8qKlwiLFxuICAgICAgICBcIioqL25vZGVfbW9kdWxlcy8qKlwiLFxuICAgICAgICBcIioqL2xhcmF2ZWwtYXBpLyoqXCIsXG4gICAgICBdLFxuICAgIH0sXG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbX19kaXJuYW1lXSxcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGlcIjoge1xuICAgICAgICB0YXJnZXQ6IEFQSV9QUk9YWV9UQVJHRVQsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiAhSVNfUkVQTElULFxuICAgICAgICBjb25maWd1cmU6IChwcm94eTogYW55KSA9PiB7XG4gICAgICAgICAgcHJveHkub24oXCJwcm94eVJlcVwiLCAocHJveHlSZXE6IGFueSwgcmVxOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGF1dGggPSByZXEuaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG4gICAgICAgICAgICBpZiAoYXV0aCkgcHJveHlSZXEuc2V0SGVhZGVyKFwiQXV0aG9yaXphdGlvblwiLCBhdXRoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvb2tpZSA9IHJlcS5oZWFkZXJzW1wiY29va2llXCJdO1xuICAgICAgICAgICAgaWYgKGNvb2tpZSkgcHJveHlSZXEuc2V0SGVhZGVyKFwiQ29va2llXCIsIGNvb2tpZSk7XG4gICAgICAgICAgICBpZiAoIUlTX1JFUExJVCkge1xuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoXCJPcmlnaW5cIiwgXCJodHRwczovL3RoZWpvdXJuZXktbWEub3JnXCIpO1xuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoXCJSZWZlcmVyXCIsIFwiaHR0cHM6Ly90aGVqb3VybmV5LW1hLm9yZy9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyOiBhbnksIF9yZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IElTX1JFUExJVCA/IFwibG9jYWwgQVBJICgzMDAxKVwiIDogXCJleHRlcm5hbCBBUElcIjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbcHJveHldIFwiICsgdGFyZ2V0ICsgXCIgdW5hdmFpbGFibGU6XCIsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXMgJiYgIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMywgeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiQVBJIHVuYXZhaWxhYmxlIC0gcGxlYXNlIHRyeSBhZ2FpbiBpbiBhIG1vbWVudC5cIiB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXCIvdXBsb2Fkc1wiOiB7XG4gICAgICAgIHRhcmdldDogQVBJX1BST1hZX1RBUkdFVCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6ICFJU19SRVBMSVQsXG4gICAgICB9LFxuICAgICAgXCIvc3RvcmFnZVwiOiB7XG4gICAgICAgIHRhcmdldDogQVBJX1BST1hZX1RBUkdFVCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6ICFJU19SRVBMSVQsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHtcbiAgICAgIC8vIEludGVyY2VwdCBHRVQgL2FwaS9jbXMvbWVkaWEvOmlkIC0gY2hlY2sgbG9jYWwgdXBsb2FkcyBmaXJzdFxuICAgICAgbmFtZTogXCJzZXJ2ZS1jbXMtbWVkaWEtYnktaWRcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJHRVRcIikgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IHJlcS51cmwgPz8gXCJcIjtcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXlxcL2FwaVxcL2Ntc1xcL21lZGlhXFwvKFxcZCspLyk7XG4gICAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICBjb25zdCBpZCA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZzID0gYXdhaXQgaW1wb3J0KFwiZnMvcHJvbWlzZXNcIik7XG4gICAgICAgICAgICBjb25zdCBwYXRoTW9kID0gYXdhaXQgaW1wb3J0KFwicGF0aFwiKTtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZHNEaXIgPSBwYXRoTW9kLnJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpYy91cGxvYWRzXCIpO1xuICAgICAgICAgICAgY29uc3QgaW5kZXhGaWxlID0gcGF0aE1vZC5qb2luKHVwbG9hZHNEaXIsIFwibWVkaWEtaW5kZXguanNvblwiKTtcbiAgICAgICAgICAgIGxldCBpdGVtczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIHRyeSB7IGl0ZW1zID0gSlNPTi5wYXJzZShhd2FpdCBmcy5yZWFkRmlsZShpbmRleEZpbGUsIFwidXRmLThcIikpOyB9IGNhdGNoIHt9XG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IGl0ZW1zLmZpbmQoKHg6IGFueSkgPT4geC5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYgKCFlbnRyeSkgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aE1vZC5qb2luKHVwbG9hZHNEaXIsIGVudHJ5LmZpbGVOYW1lKTtcbiAgICAgICAgICAgIGxldCBiaW5hcnk6IEJ1ZmZlcjtcbiAgICAgICAgICAgIHRyeSB7IGJpbmFyeSA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoKTsgfSBjYXRjaCB7IHJldHVybiBuZXh0KCk7IH1cbiAgICAgICAgICAgIGNvbnN0IGV4dCA9IGVudHJ5LmZpbGVOYW1lLnNwbGl0KFwiLlwiKS5wb3AoKT8udG9Mb3dlckNhc2UoKSA/PyBcImpwZ1wiO1xuICAgICAgICAgICAgY29uc3QgbWltZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICAgICAganBnOiBcImltYWdlL2pwZWdcIiwganBlZzogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgIHBuZzogXCJpbWFnZS9wbmdcIiwgZ2lmOiBcImltYWdlL2dpZlwiLCB3ZWJwOiBcImltYWdlL3dlYnBcIixcbiAgICAgICAgICAgICAgc3ZnOiBcImltYWdlL3N2Zyt4bWxcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBtaW1lID0gbWltZU1hcFtleHRdID8/IFwiaW1hZ2UvanBlZ1wiO1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIG1pbWUpO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJwdWJsaWMsIG1heC1hZ2U9MzYwMFwiKTtcbiAgICAgICAgICAgIHJlcy5lbmQoYmluYXJ5KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbY21zLW1lZGlhXSBFcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIEludGVyY2VwdCBHRVQgL2FwaS9tZWRpYS97aWR9IC0gY2hlY2sgbG9jYWwgdXBsb2FkcyBmaXJzdFxuICAgICAgbmFtZTogXCJzZXJ2ZS1tZWRpYS1iaW5hcnlcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJHRVRcIiB8fCAhcmVxLnVybD8uc3RhcnRzV2l0aChcIi9hcGkvbWVkaWEvXCIpKSByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIGNvbnN0IGlkID0gcmVxLnVybC5yZXBsYWNlKC9eXFwvYXBpXFwvbWVkaWFcXC8vLCBcIlwiKS5zcGxpdChcIj9cIilbMF07XG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZnMgPSBhd2FpdCBpbXBvcnQoXCJmcy9wcm9taXNlc1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhNb2QgPSBhd2FpdCBpbXBvcnQoXCJwYXRoXCIpO1xuICAgICAgICAgICAgY29uc3QgdXBsb2Fkc0RpciA9IHBhdGhNb2QucmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljL3VwbG9hZHNcIik7XG4gICAgICAgICAgICBsZXQgbG9jYWxGaWxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgZnMucmVhZGRpcih1cGxvYWRzRGlyKTtcbiAgICAgICAgICAgICAgY29uc3QgZm91bmQgPSBmaWxlcy5maW5kKChmKSA9PiBmLnN0YXJ0c1dpdGgoaWQgKyBcIi5cIikpO1xuICAgICAgICAgICAgICBpZiAoZm91bmQpIGxvY2FsRmlsZSA9IHBhdGhNb2Quam9pbih1cGxvYWRzRGlyLCBmb3VuZCk7XG4gICAgICAgICAgICB9IGNhdGNoIHt9XG4gICAgICAgICAgICBpZiAobG9jYWxGaWxlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGV4dCA9IGxvY2FsRmlsZS5zcGxpdChcIi5cIikucG9wKCkgPz8gXCJqcGdcIjtcbiAgICAgICAgICAgICAgY29uc3QgbWltZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICAgICAgICBqcGc6IFwiaW1hZ2UvanBlZ1wiLCBqcGVnOiBcImltYWdlL2pwZWdcIixcbiAgICAgICAgICAgICAgICBwbmc6IFwiaW1hZ2UvcG5nXCIsIGdpZjogXCJpbWFnZS9naWZcIiwgd2VicDogXCJpbWFnZS93ZWJwXCIsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGNvbnN0IG1pbWUgPSBtaW1lTWFwW2V4dF0gPz8gXCJpbWFnZS9qcGVnXCI7XG4gICAgICAgICAgICAgIGNvbnN0IGJpbmFyeSA9IGF3YWl0IGZzLnJlYWRGaWxlKGxvY2FsRmlsZSk7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIG1pbWUpO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcInB1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlXCIpO1xuICAgICAgICAgICAgICByZXMuZW5kKGJpbmFyeSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbc2VydmUtbWVkaWEtYmluYXJ5XSBFcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIEhhbmRsZSBGb2N1cy1TZWN0aW9uIHNldHRpbmdzIGxvY2FsbHlcbiAgICAgIG5hbWU6IFwiaGFuZGxlLWZvY3VzLXNlY3Rpb25cIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IHJlcS51cmwgPz8gXCJcIjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdXJsLnN0YXJ0c1dpdGgoXCIvYXBpL2Ntcy9mb2N1cy1zZWN0aW9uXCIpICYmXG4gICAgICAgICAgICAhdXJsLnN0YXJ0c1dpdGgoXCIvYXBpL2FkbWluL2Ntcy9mb2N1cy1zZWN0aW9uXCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBmcyA9IGF3YWl0IGltcG9ydChcImZzL3Byb21pc2VzXCIpO1xuICAgICAgICAgIGNvbnN0IHBhdGhNb2QgPSBhd2FpdCBpbXBvcnQoXCJwYXRoXCIpO1xuICAgICAgICAgIGNvbnN0IHNldHRpbmdzRmlsZSA9IHBhdGhNb2QucmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljL2ZvY3VzLXNlY3Rpb24tc2V0dGluZ3MuanNvblwiKTtcbiAgICAgICAgICBjb25zdCBERUZBVUxUID0ge1xuICAgICAgICAgICAgaWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgdGl0bGU6IFwiT3VyIEZvY3VzXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCJUb3VyaXNtLCBDdWx0dXJlLCBFbnRlcnRhaW5tZW50XCIsXG4gICAgICAgICAgICBpc19hY3RpdmU6IHRydWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhc3luYyBmdW5jdGlvbiByZWFkU2V0dGluZ3MoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgICAgIHRyeSB7IHJldHVybiBKU09OLnBhcnNlKGF3YWl0IGZzLnJlYWRGaWxlKHNldHRpbmdzRmlsZSwgXCJ1dGYtOFwiKSk7IH1cbiAgICAgICAgICAgIGNhdGNoIHsgcmV0dXJuIERFRkFVTFQ7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXN5bmMgZnVuY3Rpb24gd3JpdGVTZXR0aW5ncyhkYXRhOiBhbnkpIHtcbiAgICAgICAgICAgIGF3YWl0IGZzLm1rZGlyKHBhdGhNb2QuZGlybmFtZShzZXR0aW5nc0ZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlRmlsZShzZXR0aW5nc0ZpbGUsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09IFwiR0VUXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gYXdhaXQgcmVhZFNldHRpbmdzKCk7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQVVRcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHJlcSkgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgICAgICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcmVhZFNldHRpbmdzKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSB7IC4uLmV4aXN0aW5nLCAuLi5ib2R5LCBpZDogXCJkZWZhdWx0XCIgfTtcbiAgICAgICAgICAgICAgYXdhaXQgd3JpdGVTZXR0aW5ncyh1cGRhdGVkKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbZm9jdXMtc2VjdGlvbl0gU2V0dGluZ3Mgc2F2ZWRcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltmb2N1cy1zZWN0aW9uXSBTYXZlIGVycm9yOlwiLCBlcnIpO1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlNhdmUgZmFpbGVkXCIgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIEhhbmRsZSBpMThuIGxvY2FsZSBmaWxlIHJlYWQvd3JpdGUgbG9jYWxseVxuICAgICAgbmFtZTogXCJoYW5kbGUtaTE4bi1sb2NhbGVcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IHJlcS51cmwgPz8gXCJcIjtcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXlxcL2FwaVxcL2FkbWluXFwvaTE4blxcLyhbXj8vXSspLyk7XG4gICAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICBjb25zdCBzZWN0aW9uID0gbWF0Y2hbMV07XG4gICAgICAgICAgY29uc3QgTEFOR1MgPSBbXCJlblwiLCBcImZyXCIsIFwiYXJcIiwgXCJlc1wiXTtcbiAgICAgICAgICBjb25zdCBwYXRoTW9kID0gYXdhaXQgaW1wb3J0KFwicGF0aFwiKTtcbiAgICAgICAgICBjb25zdCBmcyA9IGF3YWl0IGltcG9ydChcImZzL3Byb21pc2VzXCIpO1xuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBMQU5HUykge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gcGF0aE1vZC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaTE4bi9sb2NhbGVzL1wiICsgbGFuZyArIFwiLmpzb25cIik7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3ID0gSlNPTi5wYXJzZShhd2FpdCBmcy5yZWFkRmlsZShmaWxlLCBcInV0Zi04XCIpKTtcbiAgICAgICAgICAgICAgICByZXN1bHRbbGFuZ10gPSByYXdbc2VjdGlvbl0gPz8ge307XG4gICAgICAgICAgICAgIH0gY2F0Y2ggeyByZXN1bHRbbGFuZ10gPSB7fTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSBcIlBVVFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgcmVxKSBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZXM6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0gSlNPTi5wYXJzZShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBMQU5HUykge1xuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlc1tsYW5nXSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHBhdGhNb2QucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2kxOG4vbG9jYWxlcy9cIiArIGxhbmcgKyBcIi5qc29uXCIpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCByYXcgPSBKU09OLnBhcnNlKGF3YWl0IGZzLnJlYWRGaWxlKGZpbGUsIFwidXRmLThcIikpO1xuICAgICAgICAgICAgICAgICAgcmF3W3NlY3Rpb25dID0geyAuLi4ocmF3W3NlY3Rpb25dID8/IHt9KSwgLi4udXBkYXRlc1tsYW5nXSB9O1xuICAgICAgICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKGZpbGUsIEpTT04uc3RyaW5naWZ5KHJhdywgbnVsbCwgMikgKyBcIlxcblwiLCBcInV0Zi04XCIpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS5lcnJvcihcIltpMThuXSBFcnJvciB1cGRhdGluZyBcIiArIGxhbmcgKyBcIi5qc29uOlwiLCBlKTsgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiU2F2ZWRcIiB9KSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltpMThuXSBTYXZlIGVycm9yOlwiLCBlcnIpO1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlNhdmUgZmFpbGVkXCIgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIEhhbmRsZSBMZWdhbCBQYWdlcyBsb2NhbGx5XG4gICAgICBuYW1lOiBcImhhbmRsZS1sZWdhbC1wYWdlc1wiLFxuICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gcmVxLnVybCA/PyBcIlwiO1xuICAgICAgICAgIGNvbnN0IHB1YmxpY01hdGNoID0gdXJsLm1hdGNoKC9eXFwvYXBpXFwvY21zXFwvbGVnYWxcXC8oW14/L10rKS8pO1xuICAgICAgICAgIGNvbnN0IGFkbWluTWF0Y2ggID0gdXJsLm1hdGNoKC9eXFwvYXBpXFwvYWRtaW5cXC9jbXNcXC9sZWdhbFxcLyhbXj8vXSspLyk7XG4gICAgICAgICAgaWYgKCFwdWJsaWNNYXRjaCAmJiAhYWRtaW5NYXRjaCkgcmV0dXJuIG5leHQoKTtcblxuICAgICAgICAgIGNvbnN0IGZzID0gYXdhaXQgaW1wb3J0KFwiZnMvcHJvbWlzZXNcIik7XG4gICAgICAgICAgY29uc3QgcGF0aE1vZCA9IGF3YWl0IGltcG9ydChcInBhdGhcIik7XG4gICAgICAgICAgY29uc3Qgc3RvcmVGaWxlID0gcGF0aE1vZC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWMvbGVnYWwtcGFnZXMuanNvblwiKTtcblxuICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHJlYWRTdG9yZSgpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIGFueT4+IHtcbiAgICAgICAgICAgIHRyeSB7IHJldHVybiBKU09OLnBhcnNlKGF3YWl0IGZzLnJlYWRGaWxlKHN0b3JlRmlsZSwgXCJ1dGYtOFwiKSk7IH1cbiAgICAgICAgICAgIGNhdGNoIHsgcmV0dXJuIHt9OyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdyaXRlU3RvcmUoZGF0YTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgICAgICAgICAgYXdhaXQgZnMubWtkaXIocGF0aE1vZC5kaXJuYW1lKHN0b3JlRmlsZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHN0b3JlRmlsZSwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHBhZ2VLZXkgPSAoYWRtaW5NYXRjaD8uWzFdID8/IHB1YmxpY01hdGNoIVsxXSkuc3BsaXQoXCI/XCIpWzBdO1xuXG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09IFwiR0VUXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gYXdhaXQgcmVhZFN0b3JlKCk7XG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IHN0b3JlW3BhZ2VLZXldID8/IHsgcGFnZUtleSwgY29udGVudDogXCJcIiB9O1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZW50cnkpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQVVRcIiAmJiBhZG1pbk1hdGNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgcmVxKSBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RvcmUgPSBhd2FpdCByZWFkU3RvcmUoKTtcbiAgICAgICAgICAgICAgc3RvcmVbcGFnZUtleV0gPSB7IC4uLihzdG9yZVtwYWdlS2V5XSA/PyB7fSksIC4uLmJvZHksIHBhZ2VLZXkgfTtcbiAgICAgICAgICAgICAgYXdhaXQgd3JpdGVTdG9yZShzdG9yZSk7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShzdG9yZVtwYWdlS2V5XSkpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsZWdhbC1wYWdlc10gU2F2ZWQgXFxcIlwiICsgcGFnZUtleSArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2hhbmRsZS1sZWdhbC1wYWdlc10gU2F2ZSBlcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogXCJGYWlsZWQgdG8gc2F2ZSBsZWdhbCBwYWdlXCIgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gSGFuZGxlIENvb2tpZSBDb25zZW50IHNldHRpbmdzIGxvY2FsbHlcbiAgICAgIG5hbWU6IFwiaGFuZGxlLWNvb2tpZS1zZXR0aW5nc1wiLFxuICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gcmVxLnVybCA/PyBcIlwiO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICF1cmwuc3RhcnRzV2l0aChcIi9hcGkvY21zL2Nvb2tpZS1zZXR0aW5nc1wiKSAmJlxuICAgICAgICAgICAgIXVybC5zdGFydHNXaXRoKFwiL2FwaS9hZG1pbi9jbXMvY29va2llLXNldHRpbmdzXCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBmcyA9IGF3YWl0IGltcG9ydChcImZzL3Byb21pc2VzXCIpO1xuICAgICAgICAgIGNvbnN0IHBhdGhNb2QgPSBhd2FpdCBpbXBvcnQoXCJwYXRoXCIpO1xuICAgICAgICAgIGNvbnN0IHNldHRpbmdzRmlsZSA9IHBhdGhNb2QucmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljL2Nvb2tpZS1zZXR0aW5ncy5qc29uXCIpO1xuICAgICAgICAgIGNvbnN0IERFRkFVTFQgPSB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgZGVsYXk6IDE1MDAsXG4gICAgICAgICAgICB0aXRsZTogXCJXZSB1c2UgY29va2llcyB0byBlbmhhbmNlIHlvdXIgZXhwZXJpZW5jZVwiLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiT3VyIGNvb2tpZXMgaGVscCB1cyByZW1lbWJlciB5b3VyIHByZWZlcmVuY2VzLCBhbmFseXplIHNpdGUgdHJhZmZpYywgYW5kIHByb3ZpZGUgcGVyc29uYWxpemVkIGNvbnRlbnQuIEVzc2VudGlhbCBjb29raWVzIGFyZSBhbHdheXMgYWN0aXZlLlwiLFxuICAgICAgICAgICAgY2F0ZWdvcmllczogW1xuICAgICAgICAgICAgICB7IGtleTogXCJuZWNlc3NhcnlcIiwgbGFiZWw6IFwiTmVjZXNzYXJ5IENvb2tpZXNcIiwgZGVzY3JpcHRpb246IFwiUmVxdWlyZWQgZm9yIGJhc2ljIHNpdGUgZnVuY3Rpb25hbGl0eVwiLCBlbmFibGVkOiB0cnVlLCBsb2NrZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgeyBrZXk6IFwiZnVuY3Rpb25hbFwiLCBsYWJlbDogXCJGdW5jdGlvbmFsIENvb2tpZXNcIiwgZGVzY3JpcHRpb246IFwiUmVtZW1iZXIgeW91ciBwcmVmZXJlbmNlcyBhbmQgc2V0dGluZ3NcIiwgZW5hYmxlZDogdHJ1ZSwgbG9ja2VkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICB7IGtleTogXCJhbmFseXRpY3NcIiwgbGFiZWw6IFwiQW5hbHl0aWNzIENvb2tpZXNcIiwgZGVzY3JpcHRpb246IFwiSGVscCB1cyB1bmRlcnN0YW5kIGhvdyBvdXIgd2Vic2l0ZSBpcyBiZWluZyB1c2VkXCIsIGVuYWJsZWQ6IHRydWUsIGxvY2tlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgeyBrZXk6IFwibWFya2V0aW5nXCIsIGxhYmVsOiBcIk1hcmtldGluZyBDb29raWVzXCIsIGRlc2NyaXB0aW9uOiBcIlBlcnNvbmFsaXplZCBjb250ZW50IGFuZCBhZHNcIiwgZW5hYmxlZDogdHJ1ZSwgbG9ja2VkOiBmYWxzZSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHJlYWRTZXR0aW5ncygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAgICAgdHJ5IHsgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgZnMucmVhZEZpbGUoc2V0dGluZ3NGaWxlLCBcInV0Zi04XCIpKTsgfVxuICAgICAgICAgICAgY2F0Y2ggeyByZXR1cm4gREVGQVVMVDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBhc3luYyBmdW5jdGlvbiB3cml0ZVNldHRpbmdzKGRhdGE6IGFueSkge1xuICAgICAgICAgICAgYXdhaXQgZnMubWtkaXIocGF0aE1vZC5kaXJuYW1lKHNldHRpbmdzRmlsZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHNldHRpbmdzRmlsZSwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBhd2FpdCByZWFkU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSBcIlBVVFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjaHVua3M6IEJ1ZmZlcltdID0gW107XG4gICAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgcmVxKSBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCByZWFkU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IHsgLi4uZXhpc3RpbmcsIC4uLmJvZHkgfTtcbiAgICAgICAgICAgICAgYXdhaXQgd3JpdGVTZXR0aW5ncyh1cGRhdGVkKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2Nvb2tpZS1zZXR0aW5nc10gRXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHNhdmVcIiB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gSGFuZGxlIGF1dG8tdHJhbnNsYXRlIG9ubHlcbiAgICAgIG5hbWU6IFwiaGFuZGxlLWF1dG8tdHJhbnNsYXRlXCIsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3QgdXJsOiBzdHJpbmcgPSByZXEudXJsID8/IFwiXCI7XG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiIHx8ICF1cmwuc3RhcnRzV2l0aChcIi9hcGkvYWRtaW4vdHJhbnNsYXRpb25zL2F1dG8tdHJhbnNsYXRlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZXEpIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnN0IHsgdGV4dHMsIHRhcmdldExhbmd1YWdlIH0gPSBib2R5O1xuICAgICAgICAgICAgaWYgKCF0ZXh0cyB8fCAhQXJyYXkuaXNBcnJheSh0ZXh0cykgfHwgIXRhcmdldExhbmd1YWdlKSB7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiB9KSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxhbmdNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7IGFyOiBcImFyXCIsIGZyOiBcImZyXCIsIGVzOiBcImVzXCIgfTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldExhbmcgPSBsYW5nTWFwW3RhcmdldExhbmd1YWdlXTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0TGFuZykge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlVuc3VwcG9ydGVkIGxhbmd1YWdlXCIgfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB0cmFuc2xhdGVDaHVuayh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICAgICAgICBjb25zdCBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm15bWVtb3J5LnRyYW5zbGF0ZWQubmV0L2dldD9xPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpICsgXCImbGFuZ3BhaXI9ZW58XCIgKyB0YXJnZXRMYW5nO1xuICAgICAgICAgICAgICBjb25zdCBhcGlSZXMgPSBhd2FpdCBmZXRjaChhcGlVcmwpO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgYXBpUmVzLmpzb24oKSBhcyBhbnk7XG4gICAgICAgICAgICAgIHJldHVybiBkYXRhPy5yZXNwb25zZVN0YXR1cyA9PT0gMjAwID8gKGRhdGEucmVzcG9uc2VEYXRhPy50cmFuc2xhdGVkVGV4dCA/PyB0ZXh0KSA6IHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB0cmFuc2xhdGVMb25nVGV4dCh2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgICAgICAgY29uc3QgTElNSVQgPSA0NTA7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPD0gTElNSVQpIHJldHVybiB0cmFuc2xhdGVDaHVuayh2YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSB2YWx1ZS5zcGxpdCgvXFxuXFxuLyk7XG4gICAgICAgICAgICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhIG9mIHBhcmFncmFwaHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmEudHJpbSgpKSB7IG91dC5wdXNoKHBhcmEpOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgIGlmIChwYXJhLmxlbmd0aCA8PSBMSU1JVCkgeyBvdXQucHVzaChhd2FpdCB0cmFuc2xhdGVDaHVuayhwYXJhKSk7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBwYXJhLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVPdXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxpbmUudHJpbSgpKSB7IGxpbmVPdXQucHVzaChsaW5lKTsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgIGlmIChsaW5lLmxlbmd0aCA8PSBMSU1JVCkgeyBsaW5lT3V0LnB1c2goYXdhaXQgdHJhbnNsYXRlQ2h1bmsobGluZSkpOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VncyA9IGxpbmUubWF0Y2goLy57MSw0NTB9KD86XFxzfCQpL2cpID8/IFtsaW5lXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNlZ091dDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHNlZ3MpIHNlZ091dC5wdXNoKGF3YWl0IHRyYW5zbGF0ZUNodW5rKHNlZy50cmltKCkpKTtcbiAgICAgICAgICAgICAgICAgIGxpbmVPdXQucHVzaChzZWdPdXQuam9pbihcIiBcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXQucHVzaChsaW5lT3V0LmpvaW4oXCJcXG5cIikpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBvdXQuam9pbihcIlxcblxcblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgeyBrZXksIHZhbHVlOiB0ZXh0IH0gb2YgdGV4dHMgYXMgQXJyYXk8eyBrZXk6IHN0cmluZzsgdmFsdWU6IHN0cmluZyB9Pikge1xuICAgICAgICAgICAgICBpZiAoIXRleHQ/LnRyaW0oKSkgeyByZXN1bHRzW2tleV0gPSBcIlwiOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICByZXN1bHRzW2tleV0gPSBhd2FpdCB0cmFuc2xhdGVMb25nVGV4dCh0ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgcmVzdWx0cyB9KSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2F1dG8tdHJhbnNsYXRlXSBFcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogXCJUcmFuc2xhdGlvbiBmYWlsZWRcIiB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBIYW5kbGUgaW1hZ2UgdXBsb2FkcyBsb2NhbGx5IC0gaW50ZXJjZXB0cyBQT1NUIC9hcGkvYWRtaW4vdXBsb2FkLWltYWdlXG4gICAgICAvLyBiZWZvcmUgdGhlIHByb3h5IHNvIGl0IHdvcmtzIGluIGJvdGggbG9jYWwgZGV2IGFuZCBvbiBSZXBsaXQuXG4gICAgICBuYW1lOiBcImhhbmRsZS11cGxvYWQtaW1hZ2VcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJQT1NUXCIgfHwgcmVxLnVybCAhPT0gXCIvYXBpL2FkbWluL3VwbG9hZC1pbWFnZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZXEpIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlRGF0YTogc3RyaW5nID0gYm9keS5pbWFnZURhdGEgPz8gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlcjogc3RyaW5nID0gYm9keS5mb2xkZXIgPz8gXCJtaXNjXCI7XG5cbiAgICAgICAgICAgIGlmICghaW1hZ2VEYXRhKSB7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiTm8gaW1hZ2VEYXRhIHByb3ZpZGVkXCIgfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbW1hSWR4ID0gaW1hZ2VEYXRhLmluZGV4T2YoXCIsXCIpO1xuICAgICAgICAgICAgaWYgKCFpbWFnZURhdGEuc3RhcnRzV2l0aChcImRhdGE6XCIpIHx8IGNvbW1hSWR4IDwgMCkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIkludmFsaWQgaW1hZ2VEYXRhIGZvcm1hdFwiIH0pKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmcyA9IGF3YWl0IGltcG9ydChcImZzL3Byb21pc2VzXCIpO1xuICAgICAgICAgICAgY29uc3QgcGF0aE1vZCA9IGF3YWl0IGltcG9ydChcInBhdGhcIik7XG4gICAgICAgICAgICBjb25zdCBjcnlwdG8gPSBhd2FpdCBpbXBvcnQoXCJjcnlwdG9cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IGhlYWRlciA9IGltYWdlRGF0YS5zdWJzdHJpbmcoNSwgY29tbWFJZHgpO1xuICAgICAgICAgICAgY29uc3QgbWltZSA9IGhlYWRlci5zcGxpdChcIjtcIilbMF07XG4gICAgICAgICAgICBjb25zdCByYXdFeHQgPSBtaW1lLnNwbGl0KFwiL1wiKVsxXSA/PyBcInBuZ1wiO1xuICAgICAgICAgICAgY29uc3QgZXh0ID0gcmF3RXh0ID09PSBcImpwZWdcIiA/IFwianBnXCIgOiByYXdFeHQgPT09IFwic3ZnK3htbFwiID8gXCJzdmdcIiA6IHJhd0V4dDtcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NERhdGEgPSBpbWFnZURhdGEuc3Vic3RyaW5nKGNvbW1hSWR4ICsgMSk7XG4gICAgICAgICAgICBjb25zdCBiaW5hcnkgPSBCdWZmZXIuZnJvbShiYXNlNjREYXRhLCBcImJhc2U2NFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gKGNyeXB0byBhcyBhbnkpLnJhbmRvbVVVSUQoKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gaWQgKyBcIi5cIiArIGV4dDtcbiAgICAgICAgICAgIGNvbnN0IHNhZmVGb2xkZXIgPSBmb2xkZXIucmVwbGFjZSgvW15hLXowLTlfLV0vZ2ksIFwiX1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZHNEaXIgPSBwYXRoTW9kLnJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpYy91cGxvYWRzL1wiICsgc2FmZUZvbGRlcik7XG4gICAgICAgICAgICBhd2FpdCBmcy5ta2Rpcih1cGxvYWRzRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlRmlsZShwYXRoTW9kLmpvaW4odXBsb2Fkc0RpciwgZmlsZW5hbWUpLCBiaW5hcnkpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gXCIvdXBsb2Fkcy9cIiArIHNhZmVGb2xkZXIgKyBcIi9cIiArIGZpbGVuYW1lO1xuXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMTtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHVybCB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlt1cGxvYWQtaW1hZ2VdIFNhdmVkOiBcIiArIHVybCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW3VwbG9hZC1pbWFnZV0gRXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6IFwiVXBsb2FkIGZhaWxlZFwiIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsb0JBQW9CO0FBQ2pSLE9BQU8sV0FBVztBQUNs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
