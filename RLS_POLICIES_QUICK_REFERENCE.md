# RLS Policies Quick Reference

## 📊 Policy Summary by Table

| Table | Public Read | User Create | User Edit Own | Admin Full Access |
|-------|-------------|-------------|---------------|-------------------|
| **users** | ✅ All users | ✅ Self-registration | ✅ Own profile | ✅ All users |
| **clubs** | ✅ Active only | ✅ Authenticated | ✅ If owner | ✅ All clubs |
| **club_memberships** | ✅ Active only | ✅ Join clubs | ✅ Own memberships | ✅ All memberships |
| **club_reviews** | ✅ All reviews | ✅ Authenticated | ✅ Own reviews | ✅ All reviews |
| **club_events** | ✅ All events | ✅ Authenticated | ✅ If creator | ✅ All events |
| **event_participants** | ✅ All participants | ✅ Register | ✅ Own registration | ✅ All registrations |
| **club_gallery** | ✅ All images | ✅ Authenticated | ✅ If uploader | ✅ All images |
| **booking_events** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All events |
| **media_assets** | ✅ All media | ✅ Authenticated | ✅ If uploader | ✅ All media |
| **focus_items** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All items |
| **team_members** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All members |
| **landing_testimonials** | ✅ Approved only | ✅ Submit | ✅ If owner & not approved | ✅ All testimonials |
| **partners** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All partners |
| **site_stats** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All stats |
| **landing_sections** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All sections |
| **section_blocks** | ✅ Active only | ❌ Admin only | ❌ Admin only | ✅ All blocks |

## 🔧 Settings Tables (All follow same pattern)

All settings tables have:
- ✅ **Public Read Access** - Everyone can view
- ❌ **Admin Only Modifications** - Only admins can create/update/delete

Settings tables include:
- `about_settings`
- `booking_page_settings`
- `contact_settings`
- `footer_settings`
- `hero_settings`
- `navbar_settings`
- `partner_settings`
- `president_message_settings`
- `seo_settings`
- `theme_settings`

## 🔐 Special Cases

### Users Table
- **Password field** should be excluded from SELECT queries in your application
- Users can create their own profile
- Users can update only their own profile
- Admins can update any user

### Testimonials
- Users can submit testimonials
- Only approved testimonials are publicly visible
- Users can edit their own testimonials **only if not yet approved**
- Admins must approve testimonials to make them public

### Sessions Table
- **No public access** - completely restricted
- Managed by the authentication system only

## 🎯 Common Use Cases

### Public Visitor (Not Logged In)
✅ Can view:
- Active clubs, events, booking events
- Reviews and ratings
- Team members, partners
- All public settings
- Media/gallery images

❌ Cannot:
- Create any content
- Join clubs or register for events
- Submit reviews or testimonials

### Authenticated User
✅ Can do everything a public visitor can, PLUS:
- Create clubs
- Join/leave clubs
- Submit reviews
- Register for events
- Upload media to clubs
- Submit testimonials (pending approval)
- Edit own profile, reviews, memberships

❌ Cannot:
- Modify other users' content
- Access admin-only features
- Approve testimonials
- Manage site settings

### Admin User
✅ Can do **everything**, including:
- Full CRUD on all tables
- Approve/reject testimonials
- Manage all site settings
- Modify other users' content
- Delete any content
- Manage booking events

## 🛡️ Security Helpers

### is_admin() Function
```sql
-- Checks if current user has admin privileges
SELECT is_admin(); -- Returns true/false
```

Used throughout policies to grant admin access:
```sql
USING (is_admin()) -- Admin can see everything
USING (auth.uid() = owner_id OR is_admin()) -- Owner or admin
```

## 📝 Policy Patterns

### Pattern 1: Public Read, Admin Write
```sql
-- For content like site stats, team members, focus items
SELECT: (is_active = true OR is_admin())
INSERT/UPDATE/DELETE: is_admin()
```

### Pattern 2: User-Owned Content
```sql
-- For content like reviews, memberships
SELECT: true (everyone)
INSERT: auth.uid() = user_id
UPDATE/DELETE: auth.uid() = user_id OR is_admin()
```

### Pattern 3: Creator-Owned Content
```sql
-- For content like clubs, events
SELECT: true or is_active = true
INSERT: auth.uid() IS NOT NULL
UPDATE/DELETE: auth.uid() = created_by OR is_admin()
```

### Pattern 4: Settings (Read-only for public)
```sql
-- All settings tables
SELECT: true (everyone can read)
INSERT/UPDATE/DELETE: is_admin() only
```

## 🔄 Policy Operations

Each policy defines one operation:
- **SELECT** - Who can read/view data
- **INSERT** - Who can create new records
- **UPDATE** - Who can modify existing records
- **DELETE** - Who can remove records
- **ALL** - Shorthand for all operations

## ⚡ Quick Commands

### Check if RLS is enabled on a table:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'your_table_name';
```

### List all policies for a table:
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

### Disable RLS on a table (not recommended):
```sql
ALTER TABLE your_table_name DISABLE ROW LEVEL SECURITY;
```

### Enable RLS on a table:
```sql
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
```

---

**Legend:**
- ✅ = Allowed
- ❌ = Not Allowed
- 🔐 = Requires Authentication
- 👑 = Admin Only
