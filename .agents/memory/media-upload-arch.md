---
name: Media upload architecture
description: How media uploads are routed through Vite proxy to local Laravel disk storage, and how URLs are resolved for production.
---

## Rule
All frontend media uploads must POST to either `/api/admin/media` or `/api/admin/cms/media` using `FormData` with `file` as the field name. Never use base64 JSON payloads.

## Proxy setup (vite.config.ts)
- `/api/admin/media` and `/api/admin/cms/media` → `localLaravelOptions` (target: `http://localhost:8000`)
- `/storage` → `localLaravelOptions` so uploaded files are served through Vite proxy
- Other `/api/admin` routes → `localProxyOptions` (target: external `https://api.thejourney-ma.org`)

## Laravel storage
- Files saved to `laravel-api/storage/app/public/media/{uuid}.ext`
- Symlink at `laravel-api/public/storage` (created with `php artisan storage:link`)
- Laravel returns RELATIVE URL `/storage/media/{uuid}.ext` — no APP_URL prefix

## Production URL resolution
In every upload handler, after receiving the response URL, check:
```ts
const url = rawUrl.startsWith('/storage/') && import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}${rawUrl}` : rawUrl;
```
Or use `resolveStorageUrl()` from `src/lib/apiFetch.ts`.

## start-dev.mjs
Runs `php artisan config:clear` then `php artisan serve --host=0.0.0.0 --port=8000` from `./laravel-api` alongside Vite and Node.

## Removed Vite plugins
- `handle-local-media-library` — was intercepting POST/GET for /api/admin/media locally
- `handle-media-upload` — was intercepting POST /api/admin/cms/media with base64 JSON

**Why:** These plugins stored files in `public/uploads/` which didn't persist to the MySQL DB and couldn't be served in production. The real Laravel API now handles everything via disk storage.
