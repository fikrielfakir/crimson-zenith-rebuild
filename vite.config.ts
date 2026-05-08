import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Rewrites Set-Cookie headers so they work in the Replit HTTPS dev environment:
 *   - Strips the `Domain` attribute so the browser uses the current host
 *   - Downgrades `SameSite=None` → `SameSite=Lax`
 *   - Keeps `Secure` since Replit serves over HTTPS
 */
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

const PROD_API = "https://api.thejourney-ma.org";

// Local Laravel API handles all NEW routes that don't exist on production yet
const LOCAL_API = "http://localhost:8000";

const localProxyOptions = {
  target: LOCAL_API,
  changeOrigin: true,
  secure: false,
  configure: (proxy: any) => {
    proxy.on("proxyRes", patchCookies);

    // Override Origin header so Laravel's CORS accepts the request
    // regardless of which IP/domain the browser is actually on.
    proxy.on("proxyReq", (proxyReq: any) => {
      proxyReq.setHeader("Origin", "http://localhost:5000");
    });

    // When the local Laravel API is unreachable (cold start / restart),
    // return a proper JSON 503 instead of an empty 500 so the frontend
    // can show a meaningful error message to the user.
    proxy.on("error", (err: any, _req: any, res: any) => {
      console.error("[local-proxy] Laravel API unavailable:", err.message);
      if (res && !res.headersSent) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Local API unavailable — please wait and try again." }));
      }
    });
  },
};

const proxyOptions = {
  target: PROD_API,
  changeOrigin: true,
  secure: true,
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
      // ── Routes that ONLY exist on the local Laravel API ──────────────────
      // Must be listed BEFORE the catch-all "/api" rule.
      "/api/payments":               localProxyOptions,
      "/api/admin":                  localProxyOptions,

      // ── Everything else → production API ─────────────────────────────────
      "/api": proxyOptions,
      "/sanctum": proxyOptions,
      "/storage": proxyOptions,
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
    {
      // Intercept POST /api/admin/cms/media — the production endpoint is
      // broken (missing DB columns). Handle uploads locally instead:
      //   1. Decode the base64 imageData from the JSON body
      //   2. Save the binary file to public/uploads/{uuid}.{ext}
      //   3. Return { url: '/uploads/{uuid}.{ext}', id: uuid }
      // Vite serves public/ statically, so the URL works immediately as
      // an <img src> and is short enough for the VARCHAR(500) image column.
      name: "handle-media-upload",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "POST" || req.url !== "/api/admin/cms/media") {
            return next();
          }

          try {
            const fs = await import("fs/promises");
            const path = await import("path");
            const crypto = await import("crypto");

            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString());

            const dataUrl: string = body.imageData ?? "";
            const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
            if (!match) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Invalid imageData" }));
              return;
            }

            const mime = match[1];
            const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
            const binary = Buffer.from(match[2], "base64");
            const id = crypto.randomUUID();
            const filename = `${id}.${ext}`;
            const uploadsDir = path.resolve(__dirname, "public/uploads");

            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(path.join(uploadsDir, filename), binary);

            const url = `/uploads/${filename}`;
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url, id, alt: body.alt ?? "" }));
            console.log(`[handle-media-upload] Saved ${filename} (${binary.length} bytes)`);
          } catch (err) {
            console.error("[handle-media-upload] Error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Upload failed" }));
          }
        });
      },
    },
    {
      // Intercept GET /api/media/{id} — check local uploads first, then
      // fetch the media asset JSON from production, decode the base64 data
      // URL, and serve binary image data so <img src="/api/media/{id}"> works.
      name: "serve-media-binary",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "GET" || !req.url?.startsWith("/api/media/")) {
            return next();
          }

          const id = req.url.replace(/^\/api\/media\//, "").split("?")[0];
          if (!id) return next();

          try {
            const fs = await import("fs/promises");
            const path = await import("path");

            // Check if a locally-uploaded file exists for this id
            const uploadsDir = path.resolve(__dirname, "public/uploads");
            let localFile: string | null = null;
            try {
              const files = await fs.readdir(uploadsDir);
              const match = files.find((f) => f.startsWith(id + "."));
              if (match) localFile = path.join(uploadsDir, match);
            } catch { /* directory may not exist yet */ }

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

            // Fall back to fetching from production
            const prodRes = await fetch(`${PROD_API}/api/media/${id}`, {
              headers: {
                Accept: "application/json",
                Origin: "https://thejourney-ma.org",
                Referer: "https://thejourney-ma.org/",
              },
            });

            if (!prodRes.ok) {
              res.statusCode = prodRes.status;
              res.end();
              return;
            }

            const data = await prodRes.json();
            const dataUrl: string = data.url || data.file_url || "";
            const b64Match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
            if (b64Match) {
              const mime = b64Match[1];
              const binary = Buffer.from(b64Match[2], "base64");
              res.statusCode = 200;
              res.setHeader("Content-Type", mime);
              res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
              res.end(binary);
              return;
            }

            if (dataUrl.startsWith("http")) {
              res.statusCode = 302;
              res.setHeader("Location", dataUrl);
              res.end();
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch (err) {
            console.error("[serve-media-binary] Error:", err);
            next();
          }
        });
      },
    },
    {
      // Intercept POST /api/register to inject the missing `name` field
      // that the production DB requires. This fixes signup without needing
      // any changes on the production server.
      name: "fix-register-name-field",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (req.method !== "POST" || req.url !== "/api/register") {
            return next();
          }

          try {
            // Read the full request body
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString();
            const body = JSON.parse(raw);

            // Inject `name` so the production DB constraint is satisfied
            if (!body.name) {
              body.name = `${body.firstName || ""} ${body.lastName || ""}`.trim();
            }

            // Forward to production API with the patched body
            const prodRes = await fetch(`${PROD_API}/api/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Origin: "https://thejourney-ma.org",
                Referer: "https://thejourney-ma.org/",
              },
              body: JSON.stringify(body),
            });

            const responseText = await prodRes.text();

            // Relay status + headers + body back to the browser
            res.statusCode = prodRes.status;
            res.setHeader("Content-Type", "application/json");

            // Patch any Set-Cookie headers from the production response
            const setCookie = prodRes.headers.get("set-cookie");
            if (setCookie) {
              const patched = setCookie
                .replace(/;\s*Secure/gi, "")
                .replace(/;\s*Domain=[^;]*/gi, "; Domain=localhost")
                .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
              res.setHeader("Set-Cookie", patched);
            }

            res.end(responseText);
          } catch (err) {
            console.error("[fix-register] Error intercepting /api/register:", err);
            next();
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
