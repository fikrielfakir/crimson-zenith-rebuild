-- IMPORTANT: Run this ONLY after verifying all events are in booking_events
-- and the application is working correctly with booking_events

-- Step 1: Verify data migration
-- SELECT COUNT(*) FROM booking_events WHERE club_id IS NOT NULL;
-- This should show all migrated club events

-- Step 2: Drop the club_events table
DROP TABLE IF EXISTS club_events;

-- Step 3: Verify the application still works
-- Test all event endpoints and calendar views
