# Row Level Security (RLS) Setup Guide

## Overview
This guide explains how to apply Row Level Security policies to your Supabase database for the Morocco Clubs Journey Association platform.

## 📋 What's Included

The `database_rls_policies.sql` file contains:

✅ **28 tables** with comprehensive RLS policies
✅ **Admin helper function** to check user permissions
✅ **Public/Private access controls** for different data types
✅ **User-owned content protection** (clubs, reviews, memberships)
✅ **Settings management** (admin-only modifications)

## 🔐 Security Model

### 1. **Public Content** (Read by Everyone)
- Active clubs, events, and booking events
- Media assets and gallery images
- Team members, partners, testimonials
- Site settings (navbar, hero, footer, etc.)

### 2. **User-Owned Content** (Manage Your Own)
- User profiles
- Club memberships
- Reviews and ratings
- Event registrations
- Uploaded media

### 3. **Admin-Only Content** (Full Control)
- All settings tables
- Booking events management
- Focus items, site stats
- User management
- Content approval (testimonials)

### 4. **Protected Content** (System Only)
- Session data

## 🚀 How to Apply RLS Policies

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New query"**

### Step 2: Run the RLS Policies
1. Open the `database_rls_policies.sql` file
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **"Run"** or press `Ctrl/Cmd + Enter`

### Step 3: Verify Policies Are Applied
Run this query to check:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see all the policies listed for each table.

## 🔧 Important Configuration

### Authentication Setup

Since you're using **Passport.js** for authentication (not Supabase Auth), you need to configure how your app authenticates with Supabase:

#### Option 1: Service Role Key (Current Setup - RLS Disabled)
Your app currently uses the **service role key** which bypasses RLS. This is what you have now with "RLS disabled."

**To keep using this approach:**
- No changes needed
- Your app has full database access
- Security is handled at the application layer

#### Option 2: Enable RLS with Custom JWT
To use RLS with your Passport.js authentication:

1. **Generate JWT tokens** that Supabase can verify
2. **Configure your database client** to use these tokens
3. **Modify the `is_admin()` function** to work with your auth system

**Update the helper function** in `database_rls_policies.sql`:
```sql
-- Replace the is_admin() function with this version
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_id_from_jwt text;
BEGIN
  -- Extract user ID from JWT
  user_id_from_jwt := current_setting('request.jwt.claims', true)::json->>'sub';
  
  -- Check if user is admin
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id_from_jwt
    AND is_admin = true
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Policy Examples

### Example 1: Public Read, Admin Write
```sql
-- Everyone can view active clubs
CREATE POLICY "Active clubs are viewable by everyone"
  ON public.clubs FOR SELECT
  USING (is_active = true OR is_admin());

-- Only admins can delete clubs
CREATE POLICY "Admins can delete clubs"
  ON public.clubs FOR DELETE
  USING (is_admin());
```

### Example 2: User-Owned Content
```sql
-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.club_reviews FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());
```

### Example 3: Authenticated Users
```sql
-- Authenticated users can create clubs
CREATE POLICY "Authenticated users can create clubs"
  ON public.clubs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

## 🛡️ Testing RLS Policies

### Test as Public User (Not Logged In)
```sql
-- Should return only active clubs
SELECT * FROM clubs;

-- Should fail (no permission)
INSERT INTO clubs (name, description, location) 
VALUES ('Test Club', 'Test', 'Casablanca');
```

### Test as Regular User
```sql
-- Should succeed (creating own review)
INSERT INTO club_reviews (club_id, user_id, rating, comment)
VALUES (1, auth.uid(), 5, 'Great club!');

-- Should fail (updating someone else's review)
UPDATE club_reviews SET rating = 1 WHERE user_id != auth.uid();
```

### Test as Admin
```sql
-- Should succeed (admin can do everything)
UPDATE clubs SET is_active = false WHERE id = 1;
DELETE FROM club_reviews WHERE id = 123;
```

## ⚠️ Important Notes

1. **Current Setup**: Your app has RLS disabled and uses service role access
2. **Migration**: If you want to enable RLS, you'll need to:
   - Modify your authentication flow
   - Test thoroughly before going to production
   - Update the `is_admin()` function to work with your auth

3. **Recommendation**: Keep RLS disabled for now if:
   - Your app handles security at the application layer
   - You're using server-side middleware for permissions
   - You want to avoid complexity during development

4. **Enable RLS when**:
   - You want database-level security
   - You're exposing Supabase client directly to frontend
   - You want defense-in-depth security

## 🔄 Updating Policies

To modify a policy:
```sql
-- Drop the old policy
DROP POLICY "policy_name" ON table_name;

-- Create the new policy
CREATE POLICY "policy_name" ON table_name
  FOR SELECT
  USING (your_condition);
```

## 📚 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth with Custom JWT](https://supabase.com/docs/guides/auth/server-side/custom-claims-and-role-based-access-control)

## 🎯 Next Steps

1. **Review** the policies in `database_rls_policies.sql`
2. **Decide** if you want to enable RLS or keep current setup
3. **Test** policies in a development environment first
4. **Apply** to production only after thorough testing
5. **Monitor** for any permission issues after deployment

---

**Questions?** Review the policy file or check Supabase documentation for more details.
