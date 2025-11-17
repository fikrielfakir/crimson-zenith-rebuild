import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  serial,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: jsonb("sess").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expires)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  bio: text("bio"),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  interests: jsonb("interests").default(sql`'[]'::jsonb`),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clubs table with enhanced profile information
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: varchar("image", { length: 500 }),
  location: varchar("location", { length: 255 }).notNull(),
  memberCount: integer("member_count").default(0),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  socialMedia: jsonb("social_media").default(sql`'{}'::jsonb`),
  rating: integer("rating").default(5),
  established: varchar("established", { length: 100 }),
  isActive: boolean("is_active").default(true),
  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  ownerId: varchar("owner_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Club memberships
export const clubMemberships = pgTable("club_memberships", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  role: varchar("role", { length: 50 }).default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Club events
export const clubEvents = pgTable("club_events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 255 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  status: varchar("status", { length: 20 }).default("upcoming"), // upcoming, ongoing, completed, cancelled
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Club event participants
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => clubEvents.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  attended: boolean("attended").default(false),
});

// Club gallery/images
export const clubGallery = pgTable("club_gallery", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Club reviews/testimonials
export const clubReviews = pgTable("club_reviews", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking events table - for customizable bookable events
export const bookingEvents = pgTable("booking_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  rating: integer("rating").default(5),
  reviewCount: integer("review_count").default(0),
  category: varchar("category", { length: 100 }),
  languages: jsonb("languages").default(sql`'["English"]'::jsonb`),
  ageRange: varchar("age_range", { length: 100 }),
  groupSize: varchar("group_size", { length: 100 }),
  cancellationPolicy: text("cancellation_policy"),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  highlights: jsonb("highlights").default(sql`'[]'::jsonb`),
  included: jsonb("included").default(sql`'[]'::jsonb`),
  notIncluded: jsonb("not_included").default(sql`'[]'::jsonb`),
  schedule: jsonb("schedule").default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking page settings table
export const bookingPageSettings = pgTable("booking_page_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  headerBackgroundImage: varchar("header_background_image", { length: 500 }),
  footerText: text("footer_text"),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  enableReviews: boolean("enable_reviews").default(true),
  enableSimilarEvents: boolean("enable_similar_events").default(true),
  enableImageGallery: boolean("enable_image_gallery").default(true),
  maxParticipants: integer("max_participants").default(25),
  minimumBookingHours: integer("minimum_booking_hours").default(24),
  customCss: text("custom_css"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Tables for Landing Page Management

// Theme settings table - stores global theme colors and styling
export const themeSettings = pgTable("theme_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#112250"),
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#D8C18D"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media assets table - stores uploaded images and videos
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  altText: varchar("alt_text", { length: 500 }),
  focalPoint: jsonb("focal_point"),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Navbar settings table - stores navigation bar configuration
export const navbarSettings = pgTable("navbar_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  logoType: varchar("logo_type", { length: 20 }).default("image"),
  logoImageId: integer("logo_image_id").references(() => mediaAssets.id),
  logoSvg: text("logo_svg"),
  logoText: varchar("logo_text", { length: 255 }),
  navigationLinks: jsonb("navigation_links").default(sql`'[]'::jsonb`),
  showLanguageSwitcher: boolean("show_language_switcher").default(true),
  availableLanguages: jsonb("available_languages").default(sql`'["EN", "FR", "AR"]'::jsonb`),
  showDarkModeToggle: boolean("show_dark_mode_toggle").default(true),
  loginButtonText: varchar("login_button_text", { length: 100 }).default("Login"),
  loginButtonLink: varchar("login_button_link", { length: 500 }).default("/admin/login"),
  showLoginButton: boolean("show_login_button").default(true),
  joinButtonText: varchar("join_button_text", { length: 100 }).default("Join Us"),
  joinButtonLink: varchar("join_button_link", { length: 500 }).default("/join"),
  joinButtonStyle: varchar("join_button_style", { length: 50 }).default("secondary"),
  showJoinButton: boolean("show_join_button").default(true),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero settings table - stores hero section configuration
export const heroSettings = pgTable("hero_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  title: text("title").notNull().default("Where Adventure Meets\nTransformation"),
  subtitle: text("subtitle").notNull().default("Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities."),
  primaryButtonText: varchar("primary_button_text", { length: 100 }).default("Start Your Journey"),
  primaryButtonLink: varchar("primary_button_link", { length: 500 }).default("/discover"),
  secondaryButtonText: varchar("secondary_button_text", { length: 100 }).default("Explore Clubs"),
  secondaryButtonLink: varchar("secondary_button_link", { length: 500 }).default("/clubs"),
  backgroundType: varchar("background_type", { length: 20 }).default("image"),
  backgroundMediaId: integer("background_media_id").references(() => mediaAssets.id),
  backgroundOverlayColor: varchar("background_overlay_color", { length: 50 }).default("rgba(26, 54, 93, 0.7)"),
  backgroundOverlayOpacity: integer("background_overlay_opacity").default(70),
  titleFontSize: varchar("title_font_size", { length: 50 }).default("65px"),
  titleColor: varchar("title_color", { length: 50 }).default("#ffffff"),
  subtitleFontSize: varchar("subtitle_font_size", { length: 50 }).default("20px"),
  subtitleColor: varchar("subtitle_color", { length: 50 }).default("#ffffff"),
  enableTypewriter: boolean("enable_typewriter").default(true),
  typewriterTexts: jsonb("typewriter_texts").default(sql`'[]'::jsonb`),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing page sections table - stores all sections configuration
export const landingSections = pgTable("landing_sections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  sectionType: varchar("section_type", { length: 50 }).notNull(),
  ordering: integer("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  backgroundColor: varchar("background_color", { length: 50 }),
  backgroundMediaId: integer("background_media_id").references(() => mediaAssets.id),
  titleFontSize: varchar("title_font_size", { length: 50 }).default("32px"),
  titleColor: varchar("title_color", { length: 50 }).default("#112250"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Section blocks table - stores dynamic content for each section
export const sectionBlocks = pgTable("section_blocks", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => landingSections.id).notNull(),
  blockType: varchar("block_type", { length: 50 }).notNull(),
  ordering: integer("ordering").default(0).notNull(),
  content: jsonb("content").default(sql`'{}'::jsonb`).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Focus items table - for "Our Focus" section
export const focusItems = pgTable("focus_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  description: text("description").notNull(),
  ordering: integer("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  mediaId: integer("media_id").references(() => mediaAssets.id),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table - for "Our Team" section
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio"),
  photoId: integer("photo_id").references(() => mediaAssets.id),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  socialLinks: jsonb("social_links").default(sql`'{}'::jsonb`),
  ordering: integer("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing testimonials table - general testimonials for the site
export const landingTestimonials = pgTable("landing_testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  photoId: integer("photo_id").references(() => mediaAssets.id),
  rating: integer("rating").default(5),
  feedback: text("feedback").notNull(),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  ordering: integer("ordering").default(0).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stats/footprint table - for metrics display
export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  suffix: varchar("suffix", { length: 20 }),
  ordering: integer("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact settings table - for contact information
export const contactSettings = pgTable("contact_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  officeAddress: text("office_address"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  officeHours: text("office_hours"),
  mapLatitude: numeric("map_latitude", { precision: 9, scale: 6 }),
  mapLongitude: numeric("map_longitude", { precision: 9, scale: 6 }),
  formRecipients: jsonb("form_recipients").default(sql`'[]'::jsonb`),
  autoReplyEnabled: boolean("auto_reply_enabled").default(false),
  autoReplyMessage: text("auto_reply_message"),
  socialLinks: jsonb("social_links").default(sql`'{}'::jsonb`),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Footer settings table - for footer content
export const footerSettings = pgTable("footer_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  copyrightText: varchar("copyright_text", { length: 500 }),
  description: text("description"),
  links: jsonb("links").default(sql`'[]'::jsonb`),
  socialLinks: jsonb("social_links").default(sql`'{}'::jsonb`),
  newsletterEnabled: boolean("newsletter_enabled").default(true),
  newsletterTitle: varchar("newsletter_title", { length: 255 }),
  newsletterDescription: text("newsletter_description"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SEO settings table - for meta tags and SEO
export const seoSettings = pgTable("seo_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  siteTitle: varchar("site_title", { length: 255 }),
  siteDescription: text("site_description"),
  keywords: text("keywords"),
  ogImage: integer("og_image").references(() => mediaAssets.id),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  googleAnalyticsId: varchar("google_analytics_id", { length: 100 }),
  facebookPixelId: varchar("facebook_pixel_id", { length: 100 }),
  customHeadCode: text("custom_head_code"),
  customBodyCode: text("custom_body_code"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedClubs: many(clubs),
  memberships: many(clubMemberships),
  eventParticipations: many(eventParticipants),
  reviews: many(clubReviews),
  uploadedImages: many(clubGallery),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  owner: one(users, {
    fields: [clubs.ownerId],
    references: [users.id],
  }),
  memberships: many(clubMemberships),
  events: many(clubEvents),
  gallery: many(clubGallery),
  reviews: many(clubReviews),
}));

export const clubMembershipsRelations = relations(clubMemberships, ({ one }) => ({
  user: one(users, {
    fields: [clubMemberships.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [clubMemberships.clubId],
    references: [clubs.id],
  }),
}));

export const clubEventsRelations = relations(clubEvents, ({ one, many }) => ({
  club: one(clubs, {
    fields: [clubEvents.clubId],
    references: [clubs.id],
  }),
  creator: one(users, {
    fields: [clubEvents.createdBy],
    references: [users.id],
  }),
  participants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventParticipants.eventId],
    references: [clubEvents.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const clubGalleryRelations = relations(clubGallery, ({ one }) => ({
  club: one(clubs, {
    fields: [clubGallery.clubId],
    references: [clubs.id],
  }),
  uploader: one(users, {
    fields: [clubGallery.uploadedBy],
    references: [users.id],
  }),
}));

export const clubReviewsRelations = relations(clubReviews, ({ one }) => ({
  club: one(clubs, {
    fields: [clubReviews.clubId],
    references: [clubs.id],
  }),
  user: one(users, {
    fields: [clubReviews.userId],
    references: [users.id],
  }),
}));

export const bookingEventsRelations = relations(bookingEvents, ({ one }) => ({
  creator: one(users, {
    fields: [bookingEvents.createdBy],
    references: [users.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;
export type ClubMembership = typeof clubMemberships.$inferSelect;
export type ClubEvent = typeof clubEvents.$inferSelect;
export type InsertClubEvent = typeof clubEvents.$inferInsert;
export type BookingEvent = typeof bookingEvents.$inferSelect;
export type InsertBookingEvent = typeof bookingEvents.$inferInsert;
export type BookingPageSettings = typeof bookingPageSettings.$inferSelect;
export type InsertBookingPageSettings = typeof bookingPageSettings.$inferInsert;
export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = typeof themeSettings.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
export type HeroSettings = typeof heroSettings.$inferSelect;
export type InsertHeroSettings = typeof heroSettings.$inferInsert;
export type LandingSection = typeof landingSections.$inferSelect;
export type InsertLandingSection = typeof landingSections.$inferInsert;
export type SectionBlock = typeof sectionBlocks.$inferSelect;
export type InsertSectionBlock = typeof sectionBlocks.$inferInsert;
export type FocusItem = typeof focusItems.$inferSelect;
export type InsertFocusItem = typeof focusItems.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type LandingTestimonial = typeof landingTestimonials.$inferSelect;
export type InsertLandingTestimonial = typeof landingTestimonials.$inferInsert;
export type SiteStat = typeof siteStats.$inferSelect;
export type InsertSiteStat = typeof siteStats.$inferInsert;
export type ContactSettings = typeof contactSettings.$inferSelect;
export type InsertContactSettings = typeof contactSettings.$inferInsert;
export type NavbarSettings = typeof navbarSettings.$inferSelect;
export type InsertNavbarSettings = typeof navbarSettings.$inferInsert;
export type FooterSettings = typeof footerSettings.$inferSelect;
export type InsertFooterSettings = typeof footerSettings.$inferInsert;
export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertSeoSettings = typeof seoSettings.$inferInsert;