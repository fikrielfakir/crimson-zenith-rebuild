# The Journey Association — Project Audit & Roadmap

**Generated:** 2026-05-21  
**Scope:** Full-stack audit covering frontend, backend, SEO, i18n, performance, and quality

---

## Executive Summary

The platform is a mature React + Vite SPA backed by an Express/Node.js API using Drizzle ORM on PostgreSQL. The codebase is feature-rich but contains several architectural gaps that need to be resolved before it can be considered production-ready.

---

## Phase 1 — Foundation & Stability ✅ IN PROGRESS

**Goal:** Ensure the app boots cleanly on Replit with a reliable database and no broken imports.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 1.1 | Migrate DB driver from Neon serverless → pg for Replit PostgreSQL | ✅ Done | Critical |
| 1.2 | Install all missing npm packages (tsx, concurrently, etc.) | ✅ Done | Critical |
| 1.3 | Fix peer-dependency conflicts (date-fns / react-day-picker) | ✅ Done | High |
| 1.4 | Run `drizzle-kit push` to create all DB tables | 🔲 Pending | Critical |
| 1.5 | Seed admin user and initial data | 🔲 Pending | High |
| 1.6 | Verify all API routes respond (clubs, events, news, CMS) | 🔲 Pending | High |
| 1.7 | Fix session store (connect-pg-simple `sessions` table) | 🔲 Pending | High |
| 1.8 | Secure SESSION_SECRET environment variable | 🔲 Pending | Critical |

---

## Phase 2 — SEO Integration ✅ COMPLETE

**Goal:** Full search engine visibility across Google, Bing, Yahoo, Yandex.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 2.1 | `index.html` — primary meta, OG, Twitter Card, JSON-LD | ✅ Done | High |
| 2.2 | `SEOHead.tsx` — per-page dynamic SEO component | ✅ Done | High |
| 2.3 | `seo.config.ts` — centralized route metadata | ✅ Done | High |
| 2.4 | `robots.txt` — Google, Bing, Yandex, Yahoo, social crawlers | ✅ Done | High |
| 2.5 | `sitemap.xml` — all public routes with priorities | ✅ Done | Medium |
| 2.6 | `sitemap-news.xml` — Google News template | ✅ Done | Medium |
| 2.7 | Wire `SEOHead` into all 10 public pages | ✅ Done | High |
| 2.8 | Dynamic sitemap endpoint (DB-driven clubs/events/news) | 🔲 Pending | Medium |
| 2.9 | Replace verification token placeholders (Google/Bing/Yandex) | 🔲 User action | High |
| 2.10 | Submit sitemaps to search consoles | 🔲 User action | High |

---

## Phase 3 — Multilingual Integration (EN / FR / AR / ES) ✅ IN PROGRESS

**Goal:** Full 4-language support with RTL for Arabic.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 3.1 | Install react-i18next, i18next, i18next-browser-languagedetector | ✅ Done | Critical |
| 3.2 | Create i18n config with language detection + RTL switching | ✅ Done | Critical |
| 3.3 | EN translation file (all namespaces) | ✅ Done | Critical |
| 3.4 | FR translation file | ✅ Done | High |
| 3.5 | AR translation file (RTL) | ✅ Done | High |
| 3.6 | ES translation file | ✅ Done | High |
| 3.7 | `LanguageSwitcher` dropdown component | ✅ Done | High |
| 3.8 | Wire i18n into `main.tsx` | ✅ Done | Critical |
| 3.9 | Header — language switcher → real i18next, nav labels translated | ✅ Done | High |
| 3.10 | Footer — all strings translated | ✅ Done | High |
| 3.11 | Hero — taglines translated per language | ✅ Done | High |
| 3.12 | About — section titles + descriptions translated | ✅ Done | High |
| 3.13 | Stats — title, subtitle, labels translated | ✅ Done | High |
| 3.14 | Contact component — form labels, placeholders, messages | ✅ Done | High |
| 3.15 | RTL layout support (Arabic dir="rtl") | ✅ Done | High |
| 3.16 | Discover page translated | 🔲 Pending | Medium |
| 3.17 | Clubs page translated | 🔲 Pending | Medium |
| 3.18 | Events page translated | 🔲 Pending | Medium |
| 3.19 | News / Blog page translated | 🔲 Pending | Medium |
| 3.20 | Join Us form translated | 🔲 Pending | Medium |
| 3.21 | Book / Ticket page translated | 🔲 Pending | Medium |
| 3.22 | Projects page translated | 🔲 Pending | Medium |
| 3.23 | Gallery page translated | 🔲 Pending | Medium |
| 3.24 | SEO meta tags per language (hreflang, per-language og:locale) | 🔲 Pending | Medium |
| 3.25 | Admin: CMS fields for multi-language content | 🔲 Pending | Low |

---

## Phase 4 — UI/UX Polish

**Goal:** Consistent, professional, mobile-first interface.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 4.1 | Mobile navigation (BottomNavbar) i18n labels | 🔲 Pending | Medium |
| 4.2 | RTL-aware layouts (flex direction, padding, margins) | 🔲 Pending | Medium |
| 4.3 | Arabic font support (e.g., Noto Sans Arabic) | 🔲 Pending | Medium |
| 4.4 | Header responsive language switcher (mobile sheet) | 🔲 Pending | Medium |
| 4.5 | Cookie consent banner translated | 🔲 Pending | Low |
| 4.6 | Error pages (400–504) translated | 🔲 Pending | Low |
| 4.7 | Loading skeletons for data-fetched sections | 🔲 Pending | Low |

---

## Phase 5 — Backend & Security

**Goal:** Secure, production-ready API.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 5.1 | Environment secrets: SESSION_SECRET, SMTP_PASS, STRIPE_KEY | 🔲 Pending | Critical |
| 5.2 | Rate limiting on auth and contact endpoints | 🔲 Pending | High |
| 5.3 | CSRF protection for session-based auth | 🔲 Pending | High |
| 5.4 | Input validation/sanitization on all POST routes | 🔲 Pending | High |
| 5.5 | File upload validation (type, size, virus scanning) | 🔲 Pending | High |
| 5.6 | Admin route authorization checks (isAdmin middleware) | 🔲 Pending | Critical |
| 5.7 | Helmet.js security headers | 🔲 Pending | Medium |
| 5.8 | CORS configuration (restrict to production domain) | 🔲 Pending | Medium |
| 5.9 | Password reset / forgot password flow | 🔲 Pending | Medium |
| 5.10 | Email verification on registration | 🔲 Pending | Low |

---

## Phase 6 — Performance

**Goal:** Fast loads, good Core Web Vitals.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 6.1 | Image optimization (WebP conversion, lazy loading) | 🔲 Pending | High |
| 6.2 | Code splitting — lazy load non-critical pages | 🔲 Pending | High |
| 6.3 | API response caching (React Query staleTime tuning) | 🔲 Pending | Medium |
| 6.4 | Bundle analysis and tree-shaking audit | 🔲 Pending | Medium |
| 6.5 | Prefetch critical routes | 🔲 Pending | Low |
| 6.6 | Service Worker / PWA manifest | 🔲 Pending | Low |

---

## Phase 7 — Payments & Booking

**Goal:** Reliable end-to-end booking flow.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 7.1 | Stripe integration verified with test keys | 🔲 Pending | High |
| 7.2 | PayPal integration verified | 🔲 Pending | High |
| 7.3 | CMI (Moroccan gateway) integration | 🔲 Pending | Medium |
| 7.4 | PDF ticket generation tested | 🔲 Pending | Medium |
| 7.5 | Booking confirmation email (Nodemailer) | 🔲 Pending | High |
| 7.6 | Webhook handling (Stripe) | 🔲 Pending | High |

---

## Phase 8 — Deployment & Monitoring

**Goal:** Stable production deployment.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 8.1 | Production database schema pushed | 🔲 Pending | Critical |
| 8.2 | Environment variables set in Replit Secrets | 🔲 Pending | Critical |
| 8.3 | Build pipeline verified (`npm run build`) | 🔲 Pending | High |
| 8.4 | Custom domain connected (thejourney-ma.org) | 🔲 User action | High |
| 8.5 | Google Analytics 4 configured | 🔲 User action | Medium |
| 8.6 | Yandex.Metrica configured | 🔲 User action | Low |
| 8.7 | Error monitoring (Sentry or similar) | 🔲 Pending | Medium |
| 8.8 | Uptime monitoring | 🔲 Pending | Low |

---

## Legend
- ✅ Done
- 🔲 Pending  
- 👤 User action required
