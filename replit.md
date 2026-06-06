# The Journey Association (Morocco Clubs)

## Overview
A full-stack web application for "The Journey Association" — Morocco's network of adventure and cultural clubs. Features a public-facing website with clubs, events, blog, and booking system, plus a comprehensive admin panel for content and user management.

## Architecture

### Frontend (React + Vite) — port 5000
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6
- **State**: TanStack Query (React Query)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Maps**: MapLibre GL JS with Esri satellite imagery
- **Auth**: Sanctum Bearer token (stored in sessionStorage via tokenStore.ts) + session cookie fallback

### Backend (Laravel 12 / PHP 8.2) — port 8000
- **Location**: `laravel-api/`
- **Auth**: Laravel Sanctum (session-based SPA auth, file-driver sessions)
- **Routes**: `laravel-api/routes/api.php` — 110+ routes
- **Middleware**: `Authenticate` (JSON 401), `AdminMiddleware` (JSON 403)
- **Database**: MySQL on Hostinger (srv2058.hstgr.io)
- **ORM**: Eloquent (24 models)

### Proxy Setup (Vite → Laravel)
All `/api/*` and `/sanctum/*` requests from port 5000 are proxied to port 8000.

## Audit Phases
- **Phase 1** (complete): 12 bug fixes — URL mismatches, HTTP methods, bulk-reorder, BookingController
- **Phase 2** (complete): Events, News, BlogPost, JoinUs, Contact, Gallery wired to live API
- **Phase 3** (complete): Auth flows — login cache invalidation, UserProfile, ForgotPassword, UserProtectedRoute
- **Phase 4** (complete): Admin panel wired to live API — `credentials:'include'` on all 30+ admin fetch calls, URL fixes for HeroSettings/ThemeSettings GET routes, MediaLibrary fully implemented, LandingManagement replaced with functional overview page

## Admin Panel Notes
- All admin fetch calls must include `credentials: 'include'` for Sanctum session cookies
- CMS read routes are PUBLIC (`/api/cms/*`) — no auth needed for GET
- CMS write routes are ADMIN-PROTECTED (`/api/admin/cms/*`) — require session + isAdmin
- Media API: GET/POST/DELETE `/api/admin/media` (MediaController); upload via CMS: POST `/api/admin/cms/media`

## Key Files
- `laravel-api/routes/api.php` — all 110+ API route definitions
- `laravel-api/app/Http/Controllers/` — all controllers
  - `AuthController.php` — register/login/logout/user/updateProfile
  - `Admin/AdminAuthController.php` — admin login
  - `Admin/StatsController.php`, `AnalyticsController.php`, etc.
- `laravel-api/app/Models/` — 24 Eloquent models
- `laravel-api/database/migrations/` — 12 migration files (all guarded with IF NOT EXISTS)
- `laravel-api/database/seeders/` — AdminUser, Clubs, Events, CMS seeders
- `laravel-api/bootstrap/app.php` — CORS, Sanctum, middleware aliases
- `laravel-api/.env` — DB credentials, Sanctum config, session config
- `laravel-api/config/cors.php` — allowed Replit origins
- `vite.config.ts` — Vite dev server + proxy config
- `src/hooks/useAuth.ts` — frontend auth hook
- `src/hooks/useCMS.ts` — frontend CMS hooks

## Database
- **Host**: srv2058.hstgr.io:3306
- **Database**: u613266227_test
- **User**: u613266227_test
- **Password**: Set via MYSQL_PASSWORD Replit secret
- **Tables**: 26+ tables (existing from previous Drizzle ORM setup)
- **Migrations**: Use `Schema::hasTable()` guards — safe to run against existing DB

## Running Migrations & Seeds
Once MYSQL_PASSWORD is set in Replit secrets:
```bash
cd laravel-api && php artisan migrate --no-interaction
cd laravel-api && php artisan db:seed
```

## Workflows
- **Dev Server**: `npm run dev` (concurrently runs Vite on :5000 + legacy server.ts on :3001 — server.ts fails without MYSQL_PASSWORD but Vite proxy goes to Laravel :8000)
- **Laravel API**: `cd laravel-api && php artisan config:clear && php artisan serve --host=0.0.0.0 --port=8000`

## CMI Payment Gateway Integration
- **Admin UI**: `/admin/payments` — configure and toggle CMI, Cash, and Stripe
- **Backend service**: `laravel-api/app/Services/CmiPaymentService.php`
  - `buildPaymentForm()` — generates HMAC-SHA512 signed fields for CMI 3D Secure hosting
  - `verifyCallback()` — verifies server-to-server callback HMAC from CMI
- **API routes** (all public):
  - `GET /api/payments/methods` — returns which methods are enabled (cmi/cash/stripe)
  - `POST /api/payments/cmi/initiate` — creates pending ticket + returns CMI form fields
  - `POST /api/payments/cmi/callback` — CMI server-to-server callback (updates ticket status)
  - `GET /api/payments/cmi/status/{ref}` — check payment status by booking reference
- **Admin routes** (auth + admin):
  - `GET /api/admin/payment-settings` — read settings (includes masked secrets)
  - `PUT /api/admin/payment-settings` — update settings
  - `POST /api/admin/payment-settings/test` — test configured connections
- **Frontend pages**:
  - `/book/payment/success?ref=XXX` — CMI success redirect landing page
  - `/book/payment/fail?ref=XXX` — CMI failure redirect landing page
- **Payment flow**: User selects CMI → POST to initiate → backend creates pending ticket + builds signed form → frontend auto-submits form to CMI gateway → CMI redirects browser to success/fail URL + POSTs callback → backend verifies HMAC + updates ticket status
- **CMI URLs**: Test: `https://testpayment.cmi.co.ma/fim/est3Dgate` | Live: `https://payment.cmi.co.ma/fim/est3Dgate`
- **Currency**: 504 = MAD (Moroccan Dirham)

## Environment Secrets Required
- `MYSQL_PASSWORD` — Hostinger MySQL password (REQUIRED for all DB operations)

## Feature Summary
- Public website: Hero, Navbar, Clubs listing/detail, Events booking, Blog, Contact, Landing CMS
- User auth: Register, Login, Profile management, My bookings
- Admin panel: Dashboard, Users, Clubs, Events, Bookings, Blog, Media, CMS, Analytics, Applications
- 26+ DB tables: users, clubs, booking_events, booking_tickets, blog_posts, media_assets, membership_applications, club_memberships, club_gallery, club_reviews, event_participants, event_gallery, event_schedule, event_reviews, event_prices, focus_items, team_members, landing_testimonials, site_stats, partners, navbar_settings, hero_settings, theme_settings, contact_settings, seo_settings, president_message_settings

## User Preferences
- Modern React patterns with TypeScript
- shadcn/ui component library
- Responsive design
- Session-based auth (not token-based)
- BCRYPT_ROUNDS=10 (matches existing hashed passwords)
