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
  plugins: [
    react(),
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
