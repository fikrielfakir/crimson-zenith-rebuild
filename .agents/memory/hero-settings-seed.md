---
name: Hero settings seed
description: hero_settings table requires a default row or Hero component stays in skeleton state forever
---

## The problem
`storage.getHeroSettings()` returns `undefined` when no row exists. The `/api/cms/hero` route then sends `{}` (empty object). The Hero component checks `isLoading` which stays true because the query returns undefined/empty — it never moves to the error/success branch.

## Fix
Insert a default row via raw SQL on fresh databases:
```js
await pool.query(`INSERT INTO hero_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING`);
```

**Why:** The schema has defaults for all columns except `id`, so inserting just `id = 'default'` gives sensible values for everything.

## How to apply
Run this once after `drizzle-kit push` on a fresh database. The same pattern applies to other singleton settings tables (theme_settings, navbar_settings, contact_settings, etc.) — they all use `id = 'default'` as PK.
