# Simpler Approach: Just add columns to booking_events

Since you're getting foreign key errors, let's use the SAFEST approach:

## Step 1: Add columns to booking_events WITHOUT touching foreign keys

```sql
-- Just add the columns we need
ALTER TABLE booking_events
ADD COLUMN club_id INT NULL,
ADD COLUMN is_association_event TINYINT(1) DEFAULT 0,
ADD COLUMN location_details VARCHAR(255) NULL,
ADD COLUMN event_date TIMESTAMP NULL,
ADD COLUMN min_age INT NULL,
ADD COLUMN max_people INT NULL,
ADD COLUMN max_participants INT NULL,
ADD COLUMN current_participants INT DEFAULT 0,
ADD COLUMN image VARCHAR(500) NULL,
ADD COLUMN important_info TEXT NULL,
ADD COLUMN status VARCHAR(20) DEFAULT 'upcoming';
```

## Step 2: For now, keep club_events table and update the app code

- Update storage.ts to query booking_events when club_id IS NULL (booking events)
- Query booking_events when club_id IS NOT NULL (club events that were migrated)
- Query club_events for legacy data

This way:
- No foreign key changes needed
- No data loss
- App works with both tables
- We can migrate data gradually

## Step 3: Later, once everything works, manually copy specific events

You can manually INSERT specific club events into booking_events as needed.
