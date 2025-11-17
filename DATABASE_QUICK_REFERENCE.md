# Database Quick Reference Guide

## Database Tables Summary

### Total Tables: 27

---

## Table Categories

### 1. Authentication & Users (2 tables)
- `sessions` - Session storage
- `users` - User accounts

### 2. Club Management (5 tables)
- `clubs` - Club profiles
- `clubMemberships` - User-club relationships
- `clubEvents` - Club events
- `eventParticipants` - Event participants
- `clubGallery` - Club images
- `clubReviews` - Club reviews

### 3. Booking System (2 tables)
- `bookingEvents` - Bookable events
- `bookingPageSettings` - Booking configuration

### 4. CMS & Content (13 tables)
- `themeSettings` - Theme colors
- `mediaAssets` - Uploaded files
- `navbarSettings` - Navigation bar
- `heroSettings` - Hero section
- `landingSections` - Page sections
- `sectionBlocks` - Section content
- `focusItems` - Focus items
- `teamMembers` - Team members
- `landingTestimonials` - Testimonials
- `siteStats` - Statistics
- `contactSettings` - Contact info
- `footerSettings` - Footer content
- `seoSettings` - SEO settings

---

## Database Relationships Diagram

```
users (User Accounts)
├── owns → clubs (1:many)
├── member of → clubMemberships (1:many)
├── participates in → eventParticipants (1:many)
├── reviews → clubReviews (1:many)
├── uploads → clubGallery (1:many)
├── uploads → mediaAssets (1:many)
├── creates → bookingEvents (1:many)
├── creates → focusItems (1:many)
├── creates → teamMembers (1:many)
└── writes → landingTestimonials (1:many)

clubs (Club Profiles)
├── owned by → users (many:1)
├── has → clubMemberships (1:many)
├── has → clubEvents (1:many)
├── has → clubGallery (1:many)
└── has → clubReviews (1:many)

clubEvents (Events)
├── belongs to → clubs (many:1)
├── created by → users (many:1)
└── has → eventParticipants (1:many)

mediaAssets (Media Files)
├── uploaded by → users (many:1)
├── used in → navbarSettings (1:1)
├── used in → heroSettings (1:1)
├── used in → landingSections (1:many)
├── used in → focusItems (1:many)
├── used in → teamMembers (1:many)
├── used in → landingTestimonials (1:many)
└── used in → seoSettings (1:1)

landingSections (Page Sections)
└── has → sectionBlocks (1:many)
```

---

## Common Queries

### User Management

```sql
-- Get all users
SELECT * FROM users;

-- Get admin users
SELECT * FROM users WHERE is_admin = true;

-- Get user with clubs
SELECT u.*, c.* FROM users u
LEFT JOIN clubs c ON u.id = c.owner_id
WHERE u.id = 'USER_ID';
```

### Club Management

```sql
-- Get all active clubs
SELECT * FROM clubs WHERE is_active = true ORDER BY name;

-- Get club with owner
SELECT c.*, u.username, u.email FROM clubs c
LEFT JOIN users u ON c.owner_id = u.id
WHERE c.id = CLUB_ID;

-- Get club members
SELECT u.*, cm.role, cm.joined_at FROM club_memberships cm
JOIN users u ON cm.user_id = u.id
WHERE cm.club_id = CLUB_ID AND cm.is_active = true;

-- Get club events
SELECT * FROM club_events
WHERE club_id = CLUB_ID AND status = 'upcoming'
ORDER BY event_date ASC;
```

### Event Management

```sql
-- Get upcoming events
SELECT ce.*, c.name as club_name FROM club_events ce
JOIN clubs c ON ce.club_id = c.id
WHERE ce.status = 'upcoming' AND ce.event_date > NOW()
ORDER BY ce.event_date ASC;

-- Get event participants
SELECT u.*, ep.registered_at, ep.attended FROM event_participants ep
JOIN users u ON ep.user_id = u.id
WHERE ep.event_id = EVENT_ID;

-- Get user's registered events
SELECT ce.* FROM event_participants ep
JOIN club_events ce ON ep.event_id = ce.id
WHERE ep.user_id = 'USER_ID'
ORDER BY ce.event_date DESC;
```

### CMS Content

```sql
-- Get navbar settings
SELECT * FROM navbar_settings WHERE id = 'default';

-- Get hero settings
SELECT * FROM hero_settings WHERE id = 'default';

-- Get active landing sections
SELECT * FROM landing_sections
WHERE is_active = true
ORDER BY ordering ASC;

-- Get section blocks
SELECT * FROM section_blocks
WHERE section_id = SECTION_ID AND is_active = true
ORDER BY ordering ASC;

-- Get active team members
SELECT tm.*, ma.file_url as photo_url FROM team_members tm
LEFT JOIN media_assets ma ON tm.photo_id = ma.id
WHERE tm.is_active = true
ORDER BY tm.ordering ASC;

-- Get active testimonials
SELECT lt.*, ma.file_url as photo_url FROM landing_testimonials lt
LEFT JOIN media_assets ma ON lt.photo_id = ma.id
WHERE lt.is_active = true AND lt.is_approved = true
ORDER BY lt.ordering ASC;
```

### Media Management

```sql
-- Get all media assets
SELECT * FROM media_assets ORDER BY created_at DESC;

-- Get media by type
SELECT * FROM media_assets WHERE file_type = 'image' ORDER BY created_at DESC;

-- Get media by uploader
SELECT * FROM media_assets WHERE uploaded_by = 'USER_ID' ORDER BY created_at DESC;
```

### Booking System

```sql
-- Get active booking events
SELECT * FROM booking_events WHERE is_active = true ORDER BY created_at DESC;

-- Get booking page settings
SELECT * FROM booking_page_settings WHERE id = 'default';
```

---

## Field Types Quick Reference

### Common VARCHAR Lengths
- `VARCHAR(50)` - Short text (phone, role)
- `VARCHAR(100)` - Medium text (title, label)
- `VARCHAR(255)` - Standard text (name, email, location)
- `VARCHAR(500)` - Long text (URL, image path)
- `VARCHAR(1000)` - Extra long (file URL)

### Common Data Types
- `INT` - Integers (IDs, counts, ratings)
- `TEXT` - Long text (descriptions, bios)
- `JSON` - Structured data (arrays, objects)
- `TIMESTAMP` - Date and time
- `BOOLEAN` - True/false flags
- `DECIMAL(9,6)` - Coordinates (latitude/longitude)

---

## JSON Field Structures

### users.interests
```json
["hiking", "photography", "culture"]
```

### clubs.features
```json
["Guided Tours", "Local Guides", "Cultural Events"]
```

### clubs.socialMedia
```json
{
  "facebook": "https://facebook.com/...",
  "instagram": "https://instagram.com/...",
  "twitter": "https://twitter.com/..."
}
```

### bookingEvents.images
```json
[
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg"
]
```

### bookingEvents.highlights
```json
[
  "Expert local guide",
  "Small group experience",
  "Authentic cuisine"
]
```

### navbarSettings.navigationLinks
```json
[
  { "label": "Home", "url": "/", "order": 1 },
  { "label": "Clubs", "url": "/clubs", "order": 2 }
]
```

### heroSettings.typewriterTexts
```json
["Adventure", "Culture", "Community"]
```

### sectionBlocks.content
```json
{
  "title": "Our Mission",
  "description": "...",
  "image": "...",
  "link": "..."
}
```

### teamMembers.socialLinks
```json
{
  "linkedin": "https://linkedin.com/in/...",
  "email": "email@example.com"
}
```

### mediaAssets.metadata
```json
{
  "width": 1920,
  "height": 1080,
  "size": 245632,
  "format": "jpg"
}
```

---

## Default Values Reference

### Boolean Defaults
- `isActive` → `true`
- `isAdmin` → `false`
- `attended` → `false`
- `isApproved` → `false`
- `showLanguageSwitcher` → `true`
- `enableReviews` → `true`

### Integer Defaults
- `memberCount` → `0`
- `currentParticipants` → `0`
- `rating` → `5`
- `ordering` → `0`
- `maxParticipants` → `25`

### String Defaults
- `role` → `"member"`
- `status` → `"upcoming"`
- `logoType` → `"image"`
- `primaryColor` → `"#112250"`
- `secondaryColor` → `"#D8C18D"`

---

## Status Values

### clubEvents.status
- `upcoming` - Event not started yet
- `ongoing` - Event in progress
- `completed` - Event finished
- `cancelled` - Event cancelled

### clubMemberships.role
- `member` - Regular member
- `moderator` - Club moderator
- `admin` - Club administrator

---

## Indexes

### sessions
- `IDX_session_expire` on `expires`

---

## Foreign Key Relationships

### users table references
- Referenced by: clubs.ownerId, clubMemberships.userId, clubEvents.createdBy, eventParticipants.userId, clubGallery.uploadedBy, clubReviews.userId, bookingEvents.createdBy, and many CMS tables

### clubs table references
- Referenced by: clubMemberships.clubId, clubEvents.clubId, clubGallery.clubId, clubReviews.clubId

### clubEvents table references
- Referenced by: eventParticipants.eventId

### mediaAssets table references
- Referenced by: navbarSettings.logoImageId, heroSettings.backgroundMediaId, landingSections.backgroundMediaId, focusItems.mediaId, teamMembers.photoId, landingTestimonials.photoId, seoSettings.ogImage

### landingSections table references
- Referenced by: sectionBlocks.sectionId

---

## Important Notes

1. **UUID Generation**: User IDs use MySQL's UUID() function
2. **Timestamps**: All timestamps use MySQL's CURRENT_TIMESTAMP
3. **JSON Fields**: All JSON fields have default values (empty arrays or objects)
4. **Soft Deletes**: Many tables use `isActive` flag instead of hard deletes
5. **Ordering**: Most content tables have an `ordering` field for custom sorting
6. **Unique Constraints**: username, email, and slug fields have unique constraints

---

## Database Connection

The application uses:
- **ORM**: Drizzle ORM
- **Driver**: mysql2
- **Connection Pool**: Yes
- **Schema File**: `shared/schema.ts`
- **Database Config**: `server/db.ts`

---

## Migration Commands

```bash
# Push schema to database
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

---

## Environment Variables

Required database environment variables:
- `DATABASE_URL` - MySQL connection string
- Or individual variables:
  - `MYSQL_HOST`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE`
  - `MYSQL_PORT`
