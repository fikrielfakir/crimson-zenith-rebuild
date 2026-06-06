# Safe Migration Guide: Merge club_events into booking_events

## Step 1: First, add the new columns to booking_events

```sql
-- Add new columns to booking_events
ALTER TABLE booking_events
ADD COLUMN IF NOT EXISTS club_id INT NULL,
ADD COLUMN IF NOT EXISTS is_association_event TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_details VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS min_age INT NULL,
ADD COLUMN IF NOT EXISTS max_people INT NULL,
ADD COLUMN IF NOT EXISTS max_participants INT NULL,
ADD COLUMN IF NOT EXISTS current_participants INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS image VARCHAR(500) NULL,
ADD COLUMN IF NOT EXISTS important_info TEXT NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming';

-- Add foreign key for club_id
ALTER TABLE booking_events
ADD CONSTRAINT fk_booking_events_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL;
```

## Step 2: Migrate data from club_events to booking_events

```sql
-- Copy club_events data to booking_events
INSERT INTO booking_events (
  id,
  club_id,
  is_association_event,
  title,
  subtitle,
  description,
  location,
  location_details,
  event_date,
  duration,
  start_date,
  end_date,
  price,
  rating,
  category,
  languages,
  age_range,
  min_age,
  group_size,
  max_people,
  max_participants,
  current_participants,
  image,
  highlights,
  included,
  not_included,
  important_info,
  status,
  is_active,
  created_by,
  created_at,
  updated_at
)
SELECT 
  CONCAT('club-event-', id) as id,
  club_id,
  is_association_event,
  title,
  NULL as subtitle,
  COALESCE(description, '') as description,
  COALESCE(location, '') as location,
  location_details,
  event_date,
  duration,
  DATE(event_date) as start_date,
  DATE(end_date) as end_date,
  CAST(COALESCE(price, 0) AS UNSIGNED) as price,
  5 as rating,
  category,
  CASE 
    WHEN languages IS NULL OR languages = '' THEN JSON_ARRAY('English')
    ELSE JSON_ARRAY(languages)
  END as languages,
  CASE 
    WHEN min_age IS NOT NULL THEN CONCAT(min_age, '+')
    ELSE NULL
  END as age_range,
  min_age,
  CASE 
    WHEN max_people IS NOT NULL THEN CONCAT('Max ', max_people, ' people')
    ELSE NULL
  END as group_size,
  max_people,
  max_participants,
  current_participants,
  image,
  CASE 
    WHEN highlights IS NULL OR highlights = '' THEN JSON_ARRAY()
    ELSE JSON_ARRAY(highlights)
  END as highlights,
  CASE 
    WHEN included IS NULL OR included = '' THEN JSON_ARRAY()
    ELSE JSON_ARRAY(included)
  END as included,
  CASE 
    WHEN not_included IS NULL OR not_included = '' THEN JSON_ARRAY()
    ELSE JSON_ARRAY(not_included)
  END as not_included,
  important_info,
  status,
  1 as is_active,
  created_by,
  created_at,
  updated_at
FROM club_events;
```

## Step 3: Update related tables (run each separately, check constraint names first)

```sql
-- Check actual constraint names first:
SHOW CREATE TABLE event_participants;
SHOW CREATE TABLE event_gallery;
SHOW CREATE TABLE event_schedule;
SHOW CREATE TABLE event_reviews;
SHOW CREATE TABLE event_prices;
SHOW CREATE TABLE events_clubs;
```

Then drop the constraints using the actual names shown, and update the tables.

## Step 4: Drop club_events table (ONLY after verifying data migration)

```sql
-- Verify data was migrated correctly first!
SELECT COUNT(*) FROM booking_events WHERE club_id IS NOT NULL;

-- Then drop the table
DROP TABLE IF EXISTS club_events;
```
