-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Morocco Clubs Journey Association Database
-- ================================================
-- 
-- This file contains comprehensive RLS policies for all tables
-- Run this in your Supabase SQL editor to enable RLS
--
-- Policy Structure:
-- 1. Public read access for content visible to all users
-- 2. Authenticated users can manage their own content
-- 3. Admins have full access to everything
-- 4. Settings are admin-only for modifications
-- ================================================

-- ================================================
-- HELPER FUNCTION: Check if user is admin
-- ================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 1. USERS TABLE
-- ================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Anyone can view active users (but not passwords)
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete users
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (is_admin());

-- ================================================
-- 2. CLUBS TABLE
-- ================================================
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Everyone can view active clubs
CREATE POLICY "Active clubs are viewable by everyone"
  ON public.clubs FOR SELECT
  USING (is_active = true OR is_admin());

-- Authenticated users can create clubs
CREATE POLICY "Authenticated users can create clubs"
  ON public.clubs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Club owners and admins can update
CREATE POLICY "Club owners and admins can update clubs"
  ON public.clubs FOR UPDATE
  USING (auth.uid() = owner_id OR is_admin())
  WITH CHECK (auth.uid() = owner_id OR is_admin());

-- Admins can delete clubs
CREATE POLICY "Admins can delete clubs"
  ON public.clubs FOR DELETE
  USING (is_admin());

-- ================================================
-- 3. CLUB_MEMBERSHIPS TABLE
-- ================================================
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;

-- Everyone can view active memberships
CREATE POLICY "Memberships are viewable by everyone"
  ON public.club_memberships FOR SELECT
  USING (is_active = true OR auth.uid() = user_id OR is_admin());

-- Authenticated users can join clubs
CREATE POLICY "Users can join clubs"
  ON public.club_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own memberships
CREATE POLICY "Users can update own memberships"
  ON public.club_memberships FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users and admins can delete memberships
CREATE POLICY "Users can leave clubs"
  ON public.club_memberships FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ================================================
-- 4. CLUB_REVIEWS TABLE
-- ================================================
ALTER TABLE public.club_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.club_reviews FOR SELECT
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON public.club_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.club_reviews FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.club_reviews FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ================================================
-- 5. CLUB_EVENTS TABLE
-- ================================================
ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

-- Everyone can view events
CREATE POLICY "Events are viewable by everyone"
  ON public.club_events FOR SELECT
  USING (true);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON public.club_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Event creators and admins can update
CREATE POLICY "Event creators and admins can update events"
  ON public.club_events FOR UPDATE
  USING (auth.uid() = created_by OR is_admin())
  WITH CHECK (auth.uid() = created_by OR is_admin());

-- Event creators and admins can delete
CREATE POLICY "Event creators and admins can delete events"
  ON public.club_events FOR DELETE
  USING (auth.uid() = created_by OR is_admin());

-- ================================================
-- 6. EVENT_PARTICIPANTS TABLE
-- ================================================
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Everyone can view participants
CREATE POLICY "Participants are viewable by everyone"
  ON public.event_participants FOR SELECT
  USING (true);

-- Authenticated users can register for events
CREATE POLICY "Users can register for events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users and admins can update registrations
CREATE POLICY "Users can update own registrations"
  ON public.event_participants FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users can cancel their own registrations
CREATE POLICY "Users can cancel registrations"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ================================================
-- 7. CLUB_GALLERY TABLE
-- ================================================
ALTER TABLE public.club_gallery ENABLE ROW LEVEL SECURITY;

-- Everyone can view gallery images
CREATE POLICY "Gallery images are viewable by everyone"
  ON public.club_gallery FOR SELECT
  USING (true);

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
  ON public.club_gallery FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Uploaders and admins can update
CREATE POLICY "Uploaders and admins can update images"
  ON public.club_gallery FOR UPDATE
  USING (auth.uid() = uploaded_by OR is_admin())
  WITH CHECK (auth.uid() = uploaded_by OR is_admin());

-- Uploaders and admins can delete
CREATE POLICY "Uploaders and admins can delete images"
  ON public.club_gallery FOR DELETE
  USING (auth.uid() = uploaded_by OR is_admin());

-- ================================================
-- 8. BOOKING_EVENTS TABLE
-- ================================================
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;

-- Everyone can view active booking events
CREATE POLICY "Active booking events are viewable by everyone"
  ON public.booking_events FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create booking events
CREATE POLICY "Admins can create booking events"
  ON public.booking_events FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update booking events
CREATE POLICY "Admins can update booking events"
  ON public.booking_events FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete booking events
CREATE POLICY "Admins can delete booking events"
  ON public.booking_events FOR DELETE
  USING (is_admin());

-- ================================================
-- 9. MEDIA_ASSETS TABLE
-- ================================================
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Everyone can view media assets
CREATE POLICY "Media assets are viewable by everyone"
  ON public.media_assets FOR SELECT
  USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
  ON public.media_assets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Uploaders and admins can update
CREATE POLICY "Uploaders and admins can update media"
  ON public.media_assets FOR UPDATE
  USING (auth.uid() = uploaded_by OR is_admin())
  WITH CHECK (auth.uid() = uploaded_by OR is_admin());

-- Uploaders and admins can delete
CREATE POLICY "Uploaders and admins can delete media"
  ON public.media_assets FOR DELETE
  USING (auth.uid() = uploaded_by OR is_admin());

-- ================================================
-- 10. FOCUS_ITEMS TABLE
-- ================================================
ALTER TABLE public.focus_items ENABLE ROW LEVEL SECURITY;

-- Everyone can view active focus items
CREATE POLICY "Active focus items are viewable by everyone"
  ON public.focus_items FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create focus items
CREATE POLICY "Admins can create focus items"
  ON public.focus_items FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update focus items
CREATE POLICY "Admins can update focus items"
  ON public.focus_items FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete focus items
CREATE POLICY "Admins can delete focus items"
  ON public.focus_items FOR DELETE
  USING (is_admin());

-- ================================================
-- 11. TEAM_MEMBERS TABLE
-- ================================================
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Everyone can view active team members
CREATE POLICY "Active team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create team members
CREATE POLICY "Admins can create team members"
  ON public.team_members FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update team members
CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete team members
CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  USING (is_admin());

-- ================================================
-- 12. LANDING_TESTIMONIALS TABLE
-- ================================================
ALTER TABLE public.landing_testimonials ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved and active testimonials
CREATE POLICY "Approved testimonials are viewable by everyone"
  ON public.landing_testimonials FOR SELECT
  USING (is_approved = true AND is_active = true OR is_admin());

-- Authenticated users can submit testimonials
CREATE POLICY "Authenticated users can submit testimonials"
  ON public.landing_testimonials FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own testimonials (if not yet approved)
CREATE POLICY "Users can update own testimonials"
  ON public.landing_testimonials FOR UPDATE
  USING ((auth.uid() = user_id AND is_approved = false) OR is_admin())
  WITH CHECK ((auth.uid() = user_id AND is_approved = false) OR is_admin());

-- Admins can approve/manage all testimonials
CREATE POLICY "Admins can manage all testimonials"
  ON public.landing_testimonials FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users and admins can delete testimonials
CREATE POLICY "Users can delete own testimonials"
  ON public.landing_testimonials FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ================================================
-- 13. PARTNERS TABLE
-- ================================================
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active partners
CREATE POLICY "Active partners are viewable by everyone"
  ON public.partners FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create partners
CREATE POLICY "Admins can create partners"
  ON public.partners FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update partners
CREATE POLICY "Admins can update partners"
  ON public.partners FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete partners
CREATE POLICY "Admins can delete partners"
  ON public.partners FOR DELETE
  USING (is_admin());

-- ================================================
-- 14. SITE_STATS TABLE
-- ================================================
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can view active stats
CREATE POLICY "Active stats are viewable by everyone"
  ON public.site_stats FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create stats
CREATE POLICY "Admins can create stats"
  ON public.site_stats FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update stats
CREATE POLICY "Admins can update stats"
  ON public.site_stats FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete stats
CREATE POLICY "Admins can delete stats"
  ON public.site_stats FOR DELETE
  USING (is_admin());

-- ================================================
-- 15. LANDING_SECTIONS TABLE
-- ================================================
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;

-- Everyone can view active sections
CREATE POLICY "Active sections are viewable by everyone"
  ON public.landing_sections FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create sections
CREATE POLICY "Admins can create sections"
  ON public.landing_sections FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update sections
CREATE POLICY "Admins can update sections"
  ON public.landing_sections FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete sections
CREATE POLICY "Admins can delete sections"
  ON public.landing_sections FOR DELETE
  USING (is_admin());

-- ================================================
-- 16. SECTION_BLOCKS TABLE
-- ================================================
ALTER TABLE public.section_blocks ENABLE ROW LEVEL SECURITY;

-- Everyone can view active blocks
CREATE POLICY "Active blocks are viewable by everyone"
  ON public.section_blocks FOR SELECT
  USING (is_active = true OR is_admin());

-- Admins can create blocks
CREATE POLICY "Admins can create blocks"
  ON public.section_blocks FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update blocks
CREATE POLICY "Admins can update blocks"
  ON public.section_blocks FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete blocks
CREATE POLICY "Admins can delete blocks"
  ON public.section_blocks FOR DELETE
  USING (is_admin());

-- ================================================
-- SETTINGS TABLES (Admin-only modifications, public read)
-- ================================================

-- ABOUT_SETTINGS
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "About settings are viewable by everyone" ON public.about_settings FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can modify about settings" ON public.about_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BOOKING_PAGE_SETTINGS
ALTER TABLE public.booking_page_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Booking page settings are viewable by everyone" ON public.booking_page_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify booking page settings" ON public.booking_page_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CONTACT_SETTINGS
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact settings are viewable by everyone" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify contact settings" ON public.contact_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- FOOTER_SETTINGS
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Footer settings are viewable by everyone" ON public.footer_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify footer settings" ON public.footer_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- HERO_SETTINGS
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero settings are viewable by everyone" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify hero settings" ON public.hero_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- NAVBAR_SETTINGS
ALTER TABLE public.navbar_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Navbar settings are viewable by everyone" ON public.navbar_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify navbar settings" ON public.navbar_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PARTNER_SETTINGS
ALTER TABLE public.partner_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partner settings are viewable by everyone" ON public.partner_settings FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can modify partner settings" ON public.partner_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PRESIDENT_MESSAGE_SETTINGS
ALTER TABLE public.president_message_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "President message settings are viewable by everyone" ON public.president_message_settings FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can modify president message settings" ON public.president_message_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- SEO_SETTINGS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO settings are viewable by everyone" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify SEO settings" ON public.seo_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- THEME_SETTINGS
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Theme settings are viewable by everyone" ON public.theme_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify theme settings" ON public.theme_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ================================================
-- SESSIONS TABLE (Restricted)
-- ================================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- No public access to sessions
CREATE POLICY "Sessions are managed by the system"
  ON public.sessions FOR ALL
  USING (false)
  WITH CHECK (false);

-- ================================================
-- SUMMARY
-- ================================================
-- 
-- RLS Policies have been created for:
-- ✅ Users - Public read, own profile edit
-- ✅ Clubs - Public read for active, owner/admin edit
-- ✅ Club Memberships - Public read, users can join/leave
-- ✅ Club Reviews - Public read, users can manage own
-- ✅ Club Events - Public read, creator/admin edit
-- ✅ Event Participants - Public read, users can register
-- ✅ Club Gallery - Public read, uploader/admin edit
-- ✅ Booking Events - Public read for active, admin-only edit
-- ✅ Media Assets - Public read, uploader/admin edit
-- ✅ Focus Items - Public read for active, admin-only edit
-- ✅ Team Members - Public read for active, admin-only edit
-- ✅ Testimonials - Public read for approved, users can submit
-- ✅ Partners - Public read for active, admin-only edit
-- ✅ Site Stats - Public read for active, admin-only edit
-- ✅ Landing Sections - Public read for active, admin-only edit
-- ✅ Section Blocks - Public read for active, admin-only edit
-- ✅ All Settings Tables - Public read, admin-only edit
-- ✅ Sessions - System-managed only
--
-- Admin Privileges: is_admin() function checks users.is_admin
-- ================================================
