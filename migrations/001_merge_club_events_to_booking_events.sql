-- Migration: Merge club_events into booking_events
-- This migration adds fields to booking_events and migrates data from club_events

-- Step 1: Add new columns to booking_events table
ALTER TABLE booking_events
ADD COLUMN club_id INT NULL AFTER id,
ADD COLUMN is_association_event TINYINT(1) DEFAULT 0 AFTER club_id,
ADD COLUMN location_details VARCHAR(255) NULL AFTER location,
ADD COLUMN event_date TIMESTAMP NULL AFTER end_date,
ADD COLUMN min_age INT NULL AFTER age_range,
ADD COLUMN max_people INT NULL AFTER group_size,
ADD COLUMN max_participants INT NULL AFTER max_people,
ADD COLUMN current_participants INT DEFAULT 0 AFTER max_participants,
ADD COLUMN image VARCHAR(500) NULL AFTER images,
ADD COLUMN important_info TEXT NULL AFTER schedule,
ADD COLUMN status VARCHAR(20) DEFAULT 'upcoming' AFTER important_info;

-- Step 2: Add foreign key constraint for club_id
ALTER TABLE booking_events
ADD CONSTRAINT fk_booking_events_club_id 
FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL;

-- Step 3: Migrate data from club_events to booking_events
INSERT INTO booking_events (
  id,
  club_id,
  is_association_event,
  title,
  subtitle,
  description,
  location,
  location_details,
  latitude,
  longitude,
  duration,
  start_date,
  end_date,
  event_date,
  price,
  original_price,
  rating,
  review_count,
  category,
  languages,
  age_range,
  min_age,
  group_size,
  max_people,
  max_participants,
  current_participants,
  cancellation_policy,
  images,
  image,
  highlights,
  included,
  not_included,
  schedule,
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
  description,
  location,
  location_details,
  NULL as latitude,
  NULL as longitude,
  duration,
  DATE(event_date) as start_date,
  DATE(end_date) as end_date,
  event_date,
  CAST(price AS UNSIGNED) as price,
  NULL as original_price,
  5 as rating,
  0 as review_count,
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
  NULL as cancellation_policy,
  JSON_ARRAY() as images,
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
  JSON_ARRAY() as schedule,
  important_info,
  status,
  1 as is_active,
  created_by,
  created_at,
  updated_at
FROM club_events;

-- Step 4: Update event_gallery to reference the new booking_events IDs
ALTER TABLE event_gallery
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE event_gallery eg
INNER JOIN club_events ce ON eg.event_id = ce.id
SET eg.new_event_id = CONCAT('club-event-', ce.id);

-- Step 5: Update event_schedule to reference the new booking_events IDs
ALTER TABLE event_schedule
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE event_schedule es
INNER JOIN club_events ce ON es.event_id = ce.id
SET es.new_event_id = CONCAT('club-event-', ce.id);

-- Step 6: Update event_reviews to reference the new booking_events IDs
ALTER TABLE event_reviews
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE event_reviews er
INNER JOIN club_events ce ON er.event_id = ce.id
SET er.new_event_id = CONCAT('club-event-', ce.id);

-- Step 7: Update event_prices to reference the new booking_events IDs
ALTER TABLE event_prices
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE event_prices ep
INNER JOIN club_events ce ON ep.event_id = ce.id
SET ep.new_event_id = CONCAT('club-event-', ce.id);

-- Step 8: Update event_participants to reference the new booking_events IDs
ALTER TABLE event_participants
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE event_participants ep
INNER JOIN club_events ce ON ep.event_id = ce.id
SET ep.new_event_id = CONCAT('club-event-', ce.id);

-- Step 9: Update events_clubs junction table
ALTER TABLE events_clubs
ADD COLUMN new_event_id VARCHAR(255) NULL AFTER event_id;

UPDATE events_clubs ec
INNER JOIN club_events ce ON ec.event_id = ce.id
SET ec.new_event_id = CONCAT('club-event-', ce.id);

-- Step 10: Drop old event_id columns and rename new_event_id to event_id
-- event_gallery
ALTER TABLE event_gallery DROP FOREIGN KEY event_gallery_ibfk_1;
ALTER TABLE event_gallery DROP COLUMN event_id;
ALTER TABLE event_gallery CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE event_gallery ADD CONSTRAINT fk_event_gallery_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- event_schedule
ALTER TABLE event_schedule DROP FOREIGN KEY event_schedule_ibfk_1;
ALTER TABLE event_schedule DROP COLUMN event_id;
ALTER TABLE event_schedule CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE event_schedule ADD CONSTRAINT fk_event_schedule_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- event_reviews
ALTER TABLE event_reviews DROP FOREIGN KEY event_reviews_ibfk_1;
ALTER TABLE event_reviews DROP COLUMN event_id;
ALTER TABLE event_reviews CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE event_reviews ADD CONSTRAINT fk_event_reviews_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- event_prices
ALTER TABLE event_prices DROP FOREIGN KEY event_prices_ibfk_1;
ALTER TABLE event_prices DROP COLUMN event_id;
ALTER TABLE event_prices CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE event_prices ADD CONSTRAINT fk_event_prices_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- event_participants
ALTER TABLE event_participants DROP FOREIGN KEY event_participants_ibfk_1;
ALTER TABLE event_participants DROP COLUMN event_id;
ALTER TABLE event_participants CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE event_participants ADD CONSTRAINT fk_event_participants_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- events_clubs
ALTER TABLE events_clubs DROP FOREIGN KEY events_clubs_ibfk_1;
ALTER TABLE events_clubs DROP COLUMN event_id;
ALTER TABLE events_clubs CHANGE COLUMN new_event_id event_id VARCHAR(255) NOT NULL;
ALTER TABLE events_clubs ADD CONSTRAINT fk_events_clubs_event_id FOREIGN KEY (event_id) REFERENCES booking_events(id) ON DELETE CASCADE;

-- Step 11: Drop the club_events table
DROP TABLE club_events;
