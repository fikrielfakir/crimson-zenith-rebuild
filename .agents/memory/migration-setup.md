---
name: Migration setup
description: How the Journey Association app is configured to run on Replit after migration
---

## Two-workflow architecture
- **Dev Server**: `npx vite` on port 5000 — serves the React frontend
- **API Server**: `npx tsx server.ts` on port 3001 — Express backend

**Why:** The original project used a Laravel external API (`api.thejourney-ma.org`). That was replaced with a local Express server. Vite proxies all `/api/*` calls to `localhost:3001`.

## Auth
- Uses Passport.js local strategy (username + password), NOT Replit Auth
- `server/replitAuth.ts` contains `setupAuth`, `isAuthenticated`, `isAdmin` exports
- Sessions stored in PostgreSQL via `connect-pg-simple`

## Database
- PostgreSQL via Replit `DATABASE_URL` secret
- Drizzle ORM, schema at `shared/schema.ts`, storage layer at `server/storage.ts`
- Seed: `node --input-type=module` with raw `pg` Pool for seeding without tsx issues

## How to apply
When adding features, add routes directly to `server.ts`. Never rely on `server/routes.ts` (it has a `registerRoutes()` export that is not wired in).
