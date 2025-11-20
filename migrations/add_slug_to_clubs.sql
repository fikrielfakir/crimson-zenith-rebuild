-- Migration: Add slug field to clubs table
-- Run this SQL in your Hostinger MySQL database

-- Step 1: Add the slug column (nullable first to avoid errors with existing data)
ALTER TABLE clubs ADD COLUMN slug VARCHAR(255) NULL;

-- Step 2: Generate slugs for existing clubs with collision handling
SET @counter = 0;

UPDATE clubs c1
LEFT JOIN (
  SELECT 
    id,
    LOWER(REPLACE(REPLACE(REPLACE(TRIM(name), ' ', '-'), '--', '-'), '--', '-')) as base_slug,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(REPLACE(REPLACE(REPLACE(TRIM(name), ' ', '-'), '--', '-'), '--', '-'))
      ORDER BY id
    ) as rn
  FROM clubs
) c2 ON c1.id = c2.id
SET c1.slug = CASE 
  WHEN c2.rn = 1 THEN c2.base_slug
  ELSE CONCAT(c2.base_slug, '-', c2.rn)
END;

-- Step 3: Verify no duplicate slugs exist
SELECT slug, COUNT(*) as count 
FROM clubs 
GROUP BY slug 
HAVING count > 1;
-- If any rows returned above, manually fix duplicates before proceeding

-- Step 4: Make slug NOT NULL and add unique constraint
ALTER TABLE clubs MODIFY COLUMN slug VARCHAR(255) NOT NULL;
ALTER TABLE clubs ADD UNIQUE KEY unique_slug (slug);

-- Step 5: Verify the migration
SELECT id, name, slug FROM clubs ORDER BY id;
