# Slug Field Migration Guide

## Overview
The clubs table now requires a `slug` field for SEO-friendly URLs. This guide explains how to add it to your MySQL database.

## What Changed

### Database Schema
Added a new `slug` column to the `clubs` table:
- Type: `VARCHAR(255)`  
- Unique: Yes
- Not Null: Yes

### Application Features
1. **Auto-generated Slugs**: When creating a new club, the slug is automatically generated from the club name
2. **Manual Override**: Admins can manually edit the slug if needed
3. **Uniqueness Validation**: The system prevents duplicate slugs
4. **SEO-friendly URLs**: Clubs are now accessible via `/club/{slug}` (e.g., `/club/ensah`)

## Migration Steps

### Option 1: Run SQL Migration (Recommended)
1. Log into your Hostinger cPanel
2. Go to phpMyAdmin
3. Select your database
4. Go to the SQL tab
5. Copy and paste the contents of `migrations/add_slug_to_clubs.sql`
6. Click "Go" to execute

### Option 2: Manual Steps
1. **Add the column**:
   ```sql
   ALTER TABLE clubs ADD COLUMN slug VARCHAR(255) NULL;
   ```

2. **Generate slugs for existing clubs**:
   ```sql
   UPDATE clubs 
   SET slug = LOWER(REPLACE(REPLACE(TRIM(name), ' ', '-'), '--', '-'));
   ```

3. **Add constraints**:
   ```sql
   ALTER TABLE clubs MODIFY COLUMN slug VARCHAR(255) NOT NULL;
   ALTER TABLE clubs ADD UNIQUE KEY unique_slug (slug);
   ```

4. **Verify**:
   ```sql
   SELECT id, name, slug FROM clubs;
   ```

## Usage

### Creating a New Club
1. Go to `/admin/clubs/new`
2. Enter the club name (e.g., "Mountain Adventures")
3. The slug is auto-generated (e.g., "mountain-adventures")
4. Edit the slug manually if needed
5. Save the club

### Editing Existing Clubs
1. The slug field will be shown in the edit form
2. You can modify it if needed
3. The system will validate uniqueness

### Frontend Navigation
- Club cards now link to `/club/{slug}` instead of `/club/{id}`
- The slug is SEO-friendly and user-readable
- Old ID-based links won't work after migration

## Troubleshooting

### Duplicate Slug Errors
If you encounter "Slug already exists" errors:
1. Check existing slugs: `SELECT slug, COUNT(*) FROM clubs GROUP BY slug HAVING COUNT(*) > 1;`
2. Manually update duplicates: `UPDATE clubs SET slug = 'unique-name-2' WHERE id = X;`

### Migration Fails
If the SQL fails:
1. Check if the column already exists: `DESCRIBE clubs;`
2. Drop and re-add if needed: `ALTER TABLE clubs DROP COLUMN slug;`
3. Run the migration again

## Rollback
To remove the slug field (not recommended):
```sql
ALTER TABLE clubs DROP COLUMN slug;
```

Note: This will break the application's club detail pages.
