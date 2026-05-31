---
name: Missing routes pattern
description: server/routes.ts is NOT imported into server.ts — all routes must be in server.ts directly
---

## The situation
`server/routes.ts` exports `registerRoutes(app)` and has many routes defined inside it, but `server.ts` never imports or calls it. All routes in server.ts were added inline.

## Routes added during migration (were missing)
- `/api/cities`, `/api/cities/:slug` — stub, returns `[]` (frontend falls back to static `moroccoCities`)
- `/api/projects` — stub, returns `[]` (frontend falls back to static data)
- `/api/config/map-style` — reads `MAPTILER_API_KEY` env var, returns style URL
- `/api/cms/clubs-page` — calls `storage.getClubsPageSettings()`
- `/api/cms/discover` — stub, returns `{}`
- `/api/cms/partners`, `/api/cms/partner-settings` — public read endpoints
- `/api/booking-events` — alias for booking events query
- `/api/experts`, `/api/volunteer-opportunities`, `/api/volunteer-posts`, `/api/work-offers` — stubs returning `[]`
- `/api/payments/methods` — stub returning `[]`

## How to apply
When frontend gets 404 for an API route, check if it exists in `server.ts` (not routes.ts). If missing, add it to `server.ts`. Use `storage.*` methods where they exist, otherwise return sensible empty defaults.
