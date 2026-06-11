Server(server) {
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
              console.log(`[legal-pages] Saved "${pageKey}"`);
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
      // Handle Cookie Consent settings locally:
      //   GET /api/cms/cookie-settings          → public read
      //   GET /api/admin/cms/cookie-settings    → admin read
      //   PUT /api/admin/cms/cookie-settings    → admin write
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
            title: "🍪 We use cookies to enhance your experience",
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
              console.log("[cookie-settings] Settings saved");
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
      // Handle auto-translate only — all other translation read/write goes through
      // the proxy to Laravel API which stores them in MySQL.
      //   POST /api/admin/translations/auto-translate → MyMemory free translation API
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
              const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
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
            console.log(`[auto-translate] Translated ${texts.length} field(s) → ${targetLanguage}`);
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
      // Handle image uploads locally — intercepts POST /api/admin/upload-image BEFORE
      // the proxy so it works in both local dev (no Express) and on Replit.
      // Writes the file to public/uploads/<folder>/ and returns a URL path.
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
            const { imageData, folder = "misc" } = body;

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
            const ext = mime.split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") ?? "png";
            const base64Data = imageData.substring(commaIdx + 1);
            const binary = Buffer.from(base64Data, "base64");
            const id = (crypto as any).randomUUID();
            const filename = `${id}.${ext}`;
            const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "_");
            const uploadsDir = pathMod.resolve(__dirname, `public/uploads/${safeFolder}`);
            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(pathMod.join(uploadsDir, filename), binary);
            const url = `/uploads/${safeFolder}/${filename}`;

            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url }));
            console.log(`[upload-image] Saved → ${url}`);
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